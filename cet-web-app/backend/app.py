from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.predict_route import predict_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(predict_bp)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': '🎓 CET Predictor API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'health': 'GET /api/health',
            'model_info': 'GET /api/model-info',
            'predict': 'POST /api/predict'
        }
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend server is operational'
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 CET College Predictor - Backend Server")
    print("="*50)
    print("📍 Server: http://localhost:5000")
    print("📊 API Docs: http://localhost:5000/")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')