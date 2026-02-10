from flask import Flask
from flask_cors import CORS
from routes.alert_routes import alert_routes
from routes.predict_routes import predict_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(alert_routes)
app.register_blueprint(predict_bp)

if __name__ == "__main__":
    app.run(debug=True)
