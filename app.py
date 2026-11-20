from flask import Flask, render_template, Response, jsonify
import cv2
from ultralytics import YOLO
from collections import Counter

app = Flask(__name__)

model = YOLO("yolov8n.pt")
cap = cv2.VideoCapture(0)

# Contadores en vivo
contadores = Counter()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stats')
def stats():
    # Esto le manda los numeros al dashboard
    return jsonify(dict(contadores))

def gen_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        results = model(frame, verbose=False)
        # Contar lo que ve en este momento
        frame_contadores = Counter()
        for r in results:
            for box in r.boxes:
                clase = model.names[int(box.cls[0])]
                conf = float(box.conf[0])
                if conf > 0.5: # Solo cuenta si esta mas de 50% seguro
                    frame_contadores[clase] += 1
        
        # Actualizar contadores globales
        contadores.clear()
        contadores.update(frame_contadores)

        annotated = results[0].plot()
        ret, buffer = cv2.imencode('.jpg', annotated)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=False)