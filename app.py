from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure CORS to allow requests from specific origins
CORS(app, resources={r"/contact": {"origins": ["http://localhost:5000", "https://your-production-domain.com"]}})

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'ynebebtibebu31@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your-16-character-app-password')  # Replace with valid App Password
mail = Mail(app)

# Serve frontend
@app.route('/')
def home():
    return render_template('index.html')

# Send Email API
@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    sender_email = data.get('email')
    message = data.get('message')

    if not all([name, sender_email, message]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact from {name}",
            sender=sender_email,
            recipients=['ynebebtibebu31@gmail.com'],
            reply_to=sender_email
        )
        msg.body = f"Name: {name}\nEmail: {sender_email}\nMessage: {message}"
        mail.send(msg)
        return jsonify({'message': 'Message sent successfully'}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'error': f'Failed to send message: {str(e)}'}), 500

# Serve CV
@app.route('/cv')
def download_cv():
    try:
        return send_from_directory('cv', 'Yinebeb_CV.pdf', as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'CV file not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)