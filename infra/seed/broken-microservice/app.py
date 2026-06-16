from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    # BUG: Should return "status": "ok" but returns "status": "down"
    return jsonify({"status": "down"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
