from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import base64
import io
from PIL import Image
import requests
from cvzone.HandTrackingModule import HandDetector
import cv2
import numpy as np
from tensorflow.keras.models import load_model

# Create your views here.


def recog(img):
    labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'space', 'space', 'space']


    model = load_model('model_fingerspelling_V6.h5')

    img_array = np.asarray(img)
    clone = img_array.copy()
    clone_resized = cv2.resize(clone, (64,64))
    img_array=clone_resized/255
    img_final = np.expand_dims(img_array, axis=0) 
    prediction = model.predict(img_final).tolist()[0]
    
    return {labels[i]: prediction[i] for i in range(29)}






@csrf_exempt
def receive_image_view(request):
    if request.method == 'POST':
       
        img = request.FILES.get('image')
       

        cap = cv2.VideoCapture(0)
        detector = HandDetector(detectionCon=0.8, maxHands=2)

        while True:
            # Get image frame
            success, img = cap.read()

            # Find the hands and their landmarks
            hands, img = detector.findHands(img, draw=True)  # Draw landmarks on the image

            if hands:
                # Hand 1
                hand1 = hands[0]
                lmList1 = hand1["lmList"]  # List of 21 Landmark points
                bbox1 = hand1["bbox"]  # Bounding box info x,y,w,h
                centerPoint1 = hand1['center']  # center of the hand cx,cy
                handType1 = hand1["type"]  # Handtype Left or Right

                fingers1 = detector.fingersUp(hand1)

                if len(hands) == 2:
                    # Hand 2
                    hand2 = hands[1]
                    lmList2 = hand2["lmList"]  # List of 21 Landmark points
                    bbox2 = hand2["bbox"]  # Bounding box info x,y,w,h
                    centerPoint2 = hand2['center']  # center of the hand cx,cy
                    handType2 = hand2["type"]  # Hand Type "Left" or "Right"

                    fingers2 = detector.fingersUp(hand2)

                    # Find Distance between two Landmarks. Could be same hand or different hands
                    #length, info = detector.findDistance(lmList1[8], lmList2[8])

                    # Draw the distance on the image
                    #cv2.putText(img, f"Distance: {length}", (20, 50), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

        response = {
            'alphabet': recog(img),
        }

        # Assume the API response contains the alphabet
        alphabet = response.get('alphabet')
        #print(alphabet)

        return JsonResponse({'alphabet': alphabet})
    return JsonResponse({'error': 'Invalid request method'}, status=400)
