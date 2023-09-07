from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length)
        json_data = json.loads(post_data.decode("utf-8"))

        if "n1" in json_data and "n2" in json_data:
            n1 = json_data["n1"]
            n2 = json_data["n2"]
            result = n1 + n2
            response_data = {"result": result}
            response_json = json.dumps(response_data)

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(response_json.encode("utf-8"))
        else:
            self.send_response(400)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(
                'Invalid JSON data. Expected "n1" and "n2" attributes.'.encode("utf-8")
            )
