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


def Simulate_Leakage_Scenario():
    tank_information = all_configuration_items["TANK_INFORMATION"]
    leakage_scenario = all_configuration_items["LEAKAGE_SCENARIO"]
    read_configuration = all_configuration_items["READING_CONFIGURATION"]
    max_reading_frequency = int(read_configuration["maxHoursBetweenReadings"])
    min_reading_frequency = int(read_configuration["minHoursBetweenReadings"])
    leakage_scenario_readings = []

    # Get the current timestamp in epoch format
    current_time = round(float(time.time()), 1)

    for one_scenario in leakage_scenario:
        tank_readings = []
        tank_serial_number = one_scenario["tankSerialNumber"]
        leak_height = float(one_scenario["leakHeight"])
        rate_unit = one_scenario["rateUnit"]
        rate_value = float(one_scenario["rateValue"])
        leak_duration_in_hours = int(one_scenario["leakDurationInHours"])

        if rate_unit == "Minute":
            rate_value = rate_value * 60

        # Get the tank details
        selected_tank_information = [
            tank
            for tank in tank_information
            if tank["tankSerialNumber"] == tank_serial_number
        ][0]
        # Start with full tank
        tank_area_m2 = float(selected_tank_information["tankAreaM2"])
        updated_litres = float(selected_tank_information["tankCapacity"])
        updated_tank_level = round(updated_litres / (tank_area_m2 * 1000), 8)

        reading_time = current_time - (leak_duration_in_hours * 60 * 60)

        for i in range(leak_duration_in_hours):
            one_reading = {
                "tankName": selected_tank_information["tankName"],
                "tankSerialNumber": tank_serial_number,
                "telemetryDatetimeEpoch": reading_time,
                "tankLevel": updated_tank_level,
                "tankCustomerName": selected_tank_information["tankCustomerName"],
            }
            tank_readings.append(one_reading)

            # If the current tank level is higher than leak height then let it leak
            if updated_tank_level > leak_height:
                updated_litres -= rate_value
                updated_tank_level = round(updated_litres / (tank_area_m2 * 1000), 8)
                reading_time = reading_time + (60 * 60)
            else:
                break

        leakage_scenario_readings.extend(tank_readings)

    return leakage_scenario_readings


from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        result = Simulate_Leakage_Scenario()
        response_data = {"result": result}
        response_json = json.dumps(response_data)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response_json.encode("utf-8"))
