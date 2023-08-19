import torch
import torchvision
import cv2
import numpy as np

# Load a pre-trained Faster R-CNN model from torchvision
model = checkpoint['model']
model.load_state_dict(torch.load('best.pt')['state_dict'])

# Open camera
cap = cv2.VideoCapture(0)

# Load class labels (customize based on your dataset)
class_labels = ["background", "person"]

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to torch tensor
    frame_tensor = torch.from_numpy(frame).permute(2, 0, 1).float() / 255.0
    input_tensor = frame_tensor.unsqueeze(0)

    with torch.no_grad():
        predictions = model(input_tensor)
    
    boxes = predictions[0]['boxes'].detach().numpy()
    scores = predictions[0]['scores'].detach().numpy()
    labels = predictions[0]['labels'].detach().numpy()

    # Filter out detections with low scores
    threshold = 0.5
    filtered_indices = np.where(scores > threshold)[0]
    filtered_boxes = boxes[filtered_indices]
    filtered_labels = labels[filtered_indices]

    # Draw bounding boxes
    for box, label in zip(filtered_boxes, filtered_labels):
        x1, y1, x2, y2 = box.astype(int)
        label_name = class_labels[label]
        color = (0, 255, 0)  # Green color for bounding box
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, thickness=2)
        cv2.putText(frame, label_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, thickness=2)

    cv2.imshow('Object Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
