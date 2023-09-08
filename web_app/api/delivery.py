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


def Simulate_Delivery_Scenario(delivery_scenario):
    # Get the current timestamp in epoch format
    current_time = round(float(time.time()), 1)
    tank_information = all_configuration_items["TANK_INFORMATION"]

    if delivery_scenario is None:
        delivery_scenario = all_configuration_items["DELIVERY_SCENARIO"]

    delivery_scenario_readings = []

    for one_tank_scenario in delivery_scenario:
        tank_serial_number = one_tank_scenario["tankSerialNumber"]
        tank_delivery_litres = float(one_tank_scenario["deliveryLitres"])

        # Get the tank details
        selected_tank_information = [
            tank
            for tank in tank_information
            if tank["tankSerialNumber"] == tank_serial_number
        ][0]

        (
            tank_readings,
            constant_reading_litres,
            last_reading_time,
        ) = Simulate_Constant_Readings(selected_tank_information, current_time)

        # Calculate tank level
        tank_area_m2 = float(selected_tank_information["tankAreaM2"])
        updated_litres = constant_reading_litres + tank_delivery_litres
        updated_tank_level = round(updated_litres / (tank_area_m2 * 1000), 8)

        one_reading = {
            "tankName": selected_tank_information["tankName"],
            "tankSerialNumber": selected_tank_information["tankSerialNumber"],
            "telemetryDatetimeEpoch": current_time,
            "tankLevel": updated_tank_level,
            "tankCustomerName": selected_tank_information["tankCustomerName"],
        }

        tank_readings.append(one_reading)
        delivery_scenario_readings.extend(tank_readings)

    return delivery_scenario_readings


from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data.decode("utf-8"))

        result = Simulate_Delivery_Scenario(json_data)
        response_data = {"result": result}
        response_json = json.dumps(response_data)

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(response_json.encode("utf-8"))
