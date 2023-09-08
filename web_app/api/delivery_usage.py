#!/usr/bin/env python
# coding: utf-8

# In[19]:


import json
import time
from datetime import datetime, timedelta
import math


def Formatted_Print(json_objects):
    print(json.dumps(json_objects, indent=4))
    return


def Save_Formatted_File(json_objects, file_name):
    with open(file_name, "w") as json_file:
        json.dump(json_objects, json_file, indent=4)
    return


def Load_Configuration():
    with open(file_path, "r") as json_file:
        data = json.load(json_file)
    return data


file_name = "all_configuration_items.json"
Save_Formatted_File(all_configuration_items, file_name)
all_configuration_items = Load_Configuration()
# Formatted_Print(all_configuration_items)


# In[20]:


import json
import time
from datetime import datetime, timedelta
import math


def Generate_Configuration():
    all_configuration_items = {}

    reading_configuration = {
        "minHoursBetweenReadings": "1",
        "maxHoursBetweenReadings": "6",
        "daysOfConstantReadings": "3",
        "litresOfConstantReadings": "1000",
    }

    all_configuration_items["READING_CONFIGURATION"] = reading_configuration

    tank_information = [
        {
            "tankCustomerName": "Steve and Mike",
            "tankName": "Tank F",
            "tankSerialNumber": "33063",
            "tankAreaM2": "18.475",
            "tankCapacity": "42000",
        },
        {
            "tankCustomerName": "Dave and Elon",
            "tankName": "Tank D",
            "tankSerialNumber": "33435",
            "tankAreaM2": "18.475",
            "tankCapacity": "60000",
        },
        {
            "tankCustomerName": "Josh and Co",
            "tankName": "Tank Q",
            "tankSerialNumber": "33261",
            "tankAreaM2": "11.015",
            "tankCapacity": "25000",
        },
    ]
    all_configuration_items["TANK_INFORMATION"] = tank_information

    delivery_scenario_configuration = [
        {"tankSerialNumber": "33063", "deliveryLitres": "10500"},
        {"tankSerialNumber": "33435", "deliveryLitres": "15245"},
        {"tankSerialNumber": "33261", "deliveryLitres": "17350"},
    ]
    all_configuration_items["DELIVERY_SCENARIO"] = delivery_scenario_configuration

    delivery_usage_scenario_configuration = [
        {
            "dayNumber": "1",
            "activity": "Delivery",
            "litres": "10156",
            "startTime": "08:00",
            "rateUnit": "Hour",
            "rateValue": "3000",
        },
        {
            "dayNumber": "2",
            "activity": "Usage",
            "litres": "3245",
            "startTime": "12:00",
            "endTime": "15:00",
        },
        {
            "dayNumber": "3",
            "activity": "Usage",
            "litres": "5567",
            "startTime": "17:00",
            "endTime": "18:00",
        },
    ]
    all_configuration_items[
        "DELIVERY_USAGE_SCENARIO"
    ] = delivery_usage_scenario_configuration

    leakage_scenario_configuration = [
        {
            "tankSerialNumber": "33063",
            "leakHeight": "0.5",
            "rateUnit": "Minute",
            "rateValue": "10",
            "leakDurationInHours": "24",
        },
        {
            "tankSerialNumber": "33435",
            "leakHeight": "0",
            "rateUnit": "Minute",
            "rateValue": "65",
            "leakDurationInHours": "16",
        },
        {
            "tankSerialNumber": "33261",
            "leakHeight": "0.75",
            "rateUnit": "Hour",
            "rateValue": "170",
            "leakDurationInHours": "24",
        },
    ]
    all_configuration_items["LEAKAGE_SCENARIO"] = leakage_scenario_configuration
    return all_configuration_items


all_configuration_items = Generate_Configuration()


def Simulate_Constant_Readings(selected_tank_information, current_time):
    constant_readings = []

    read_configuration = all_configuration_items["READING_CONFIGURATION"]

    # Since it is constant reading, use maxHoursBetweenReadings to generate readings
    reading_frequency = int(read_configuration["maxHoursBetweenReadings"])
    number_of_days = int(read_configuration["daysOfConstantReadings"])
    constant_reading_litres = float(read_configuration["litresOfConstantReadings"])

    # Calculate tank level
    tank_area_m2 = float(selected_tank_information["tankAreaM2"])
    tank_level = round(constant_reading_litres / (tank_area_m2 * 1000), 8)

    # Generate the readings
    reading_start_time = current_time - (number_of_days * 24 * 60 * 60)
    number_of_readings = int((number_of_days * 24) / reading_frequency)

    reading_time = reading_start_time
    for i in range(number_of_readings):
        one_reading = {
            "tankName": selected_tank_information["tankName"],
            "tankSerialNumber": selected_tank_information["tankSerialNumber"],
            "telemetryDatetimeEpoch": reading_time,
            "tankLevel": tank_level,
            "tankCustomerName": selected_tank_information["tankCustomerName"],
        }

        constant_readings.append(one_reading)
        last_reading_date_time = datetime.fromtimestamp(reading_time)
        reading_time = reading_time + (reading_frequency * 60 * 60)

    return constant_readings, constant_reading_litres, last_reading_date_time


def Simulate_Delivery_Usage_Scenario():
    tank_information = all_configuration_items["TANK_INFORMATION"]
    delivery_usage_scenario = all_configuration_items["DELIVERY_USAGE_SCENARIO"]
    read_configuration = all_configuration_items["READING_CONFIGURATION"]
    max_reading_frequency = int(read_configuration["maxHoursBetweenReadings"])
    min_reading_frequency = int(read_configuration["minHoursBetweenReadings"])
    delivery_usage_scenario_readings = []

    # Get maximum day number from scenarios
    day_numbers = [
        one_scenario["dayNumber"] for one_scenario in delivery_usage_scenario
    ]
    max_day_number = int(max(day_numbers)) + 1

    # Get minimum start time from scenarios
    start_times = [
        datetime.strptime(one_scenario["startTime"], "%H:%M")
        for one_scenario in delivery_usage_scenario
    ]
    min_start_time = min(start_times)

    # Calculate the start time of generating readings
    current_date_time = datetime.now()
    start_date = current_date_time - timedelta(days=max_day_number)
    start_time = datetime(
        start_date.year,
        start_date.month,
        start_date.day,
        min_start_time.hour,
        min_start_time.minute,
    )
    # Calculate the epoch timestamp
    start_time = round(float(start_time.timestamp()), 1)

    # Sort list of dictionaries based on the 'dayNumber' key
    sorted_delivery_usage_scenario = sorted(
        delivery_usage_scenario, key=lambda x: x["dayNumber"]
    )

    for one_tank_information in tank_information:
        (
            tank_readings,
            constant_reading_litres,
            last_reading_date_time,
        ) = Simulate_Constant_Readings(one_tank_information, start_time)
        tank_serial_number = one_tank_information["tankSerialNumber"]
        tank_area_m2 = float(one_tank_information["tankAreaM2"])
        updated_litres = constant_reading_litres
        updated_tank_level = round(updated_litres / (tank_area_m2 * 1000), 8)

        for one_scenario in sorted_delivery_usage_scenario:
            day_number = int(one_scenario["dayNumber"])
            activity = one_scenario["activity"]
            activity_start_time = datetime.strptime(one_scenario["startTime"], "%H:%M")
            activity_start_date = start_date + timedelta(days=day_number - 1)
            activity_start_date_time = datetime(
                activity_start_date.year,
                activity_start_date.month,
                activity_start_date.day,
                activity_start_time.hour,
                activity_start_time.minute,
            )

            # If there is gap since the last constant reading and next activity, then generate more constant readings
            number_of_constant_readings = math.floor(
                (activity_start_date_time - last_reading_date_time).total_seconds()
                / (3600 * max_reading_frequency)
            )
            reading_time = round(float(last_reading_date_time.timestamp()), 1)

            for i in range(number_of_constant_readings):
                reading_time = reading_time + (max_reading_frequency * 60 * 60)
                last_reading_date_time = datetime.fromtimestamp(reading_time)

                one_reading = {
                    "tankName": one_tank_information["tankName"],
                    "tankSerialNumber": tank_serial_number,
                    "telemetryDatetimeEpoch": reading_time,
                    "tankLevel": updated_tank_level,
                    "tankCustomerName": one_tank_information["tankCustomerName"],
                }

                tank_readings.append(one_reading)

            if activity == "Delivery":
                litres_to_fill = float(one_scenario["litres"])
                rate_unit = one_scenario["rateUnit"]
                rate_value = float(one_scenario["rateValue"])

                if rate_unit == "Minute":
                    rate_value = rate_value * 60

                number_of_hours_needed = math.ceil(litres_to_fill / rate_value)
                # reading_time = round(float(activity_start_date_time.timestamp()), 1)

                for i in range(number_of_hours_needed):
                    litres_filled = (
                        rate_value if litres_to_fill > rate_value else litres_to_fill
                    )
                    litres_to_fill -= litres_filled

                    # Calculate tank level
                    updated_litres += litres_filled
                    updated_tank_level = round(
                        updated_litres / (tank_area_m2 * 1000), 8
                    )

                    reading_time = round(
                        float(activity_start_date_time.timestamp()), 1
                    ) + (i * 60 * 60)
                    last_reading_date_time = datetime.fromtimestamp(reading_time)

                    one_reading = {
                        "tankName": one_tank_information["tankName"],
                        "tankSerialNumber": tank_serial_number,
                        "telemetryDatetimeEpoch": reading_time,
                        "tankLevel": updated_tank_level,
                        "tankCustomerName": one_tank_information["tankCustomerName"],
                    }

                    tank_readings.append(one_reading)

            elif activity == "Usage":
                reading_time = round(float(activity_start_date_time.timestamp()), 1)
                last_reading_date_time = datetime.fromtimestamp(reading_time)
                one_reading = {
                    "tankName": one_tank_information["tankName"],
                    "tankSerialNumber": tank_serial_number,
                    "telemetryDatetimeEpoch": reading_time,
                    "tankLevel": updated_tank_level,
                    "tankCustomerName": one_tank_information["tankCustomerName"],
                }

                tank_readings.append(one_reading)

                litres_used = float(one_scenario["litres"])
                activity_end_time = datetime.strptime(one_scenario["endTime"], "%H:%M")

                # Calculate tank level
                updated_litres -= litres_used
                updated_tank_level = round(updated_litres / (tank_area_m2 * 1000), 8)

                activity_end_date_time = datetime(
                    activity_start_date.year,
                    activity_start_date.month,
                    activity_start_date.day,
                    activity_end_time.hour,
                    activity_end_time.minute,
                )

                reading_time = round(float(activity_end_date_time.timestamp()), 1)
                last_reading_date_time = datetime.fromtimestamp(reading_time)
                one_reading = {
                    "tankName": one_tank_information["tankName"],
                    "tankSerialNumber": tank_serial_number,
                    "telemetryDatetimeEpoch": reading_time,
                    "tankLevel": updated_tank_level,
                    "tankCustomerName": one_tank_information["tankCustomerName"],
                }

                tank_readings.append(one_reading)

        delivery_usage_scenario_readings.extend(tank_readings)
    return delivery_usage_scenario_readings


from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        result = Simulate_Delivery_Usage_Scenario()
        response_data = {"result": result}
        response_json = json.dumps(response_data)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response_json.encode("utf-8"))
