# Krishnasagar - WIP

Krishnasagar is a serverless video localization pipeline that automates transcription, translation, and dubbing of content using Google Cloud AI services.

> **Status:** The **Web Project** is currently in **Beta Release**. All other projects (Cloud Functions, etc.) are in **Dev Locked Mode**.

## Setup & Deployment

gcloud services enable storage.googleapis.com \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  speech.googleapis.com \
  translate.googleapis.com \
  texttospeech.googleapis.com \
  videointelligence.googleapis.com \
  youtube.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com


gsutil mb -l asia-south1 gs://krishnasagar-videos-raw
gsutil mb -l asia-south1 gs://krishnasagar-videos-processed
gsutil mb -l asia-south1 gs://krishnasagar-videos-final

### extract_audio
gcloud functions deploy krishnasagar-extract-audio \
  --runtime python39 \
  --trigger-resource krishnasagar-videos-raw \
  --trigger-event google.storage.object.finalize \
  --entry-point extract_audio \
  --memory 512MB \
  --region asia-south1 \
  --source cloud_functions/extract_audio

### transcribe_audio
  gcloud functions deploy krishnasagar-transcribe-audio \
  --runtime python39 \
  --trigger-resource krishnasagar-videos-processed \
  --trigger-event google.storage.object.finalize \
  --entry-point transcribe_audio \
  --memory 512MB \
  --region asia-south1 \
  --source cloud_functions/transcribe_audio

### translate_text
  gcloud functions deploy krishnasagar-translate-text \
  --runtime python39 \
  --trigger-resource krishnasagar-videos-processed \
  --trigger-event google.storage.object.finalize \
  --entry-point translate_text \
  --memory 512MB \
  --region asia-south1 \
  --source cloud_functions/translate_text

### generate_audio
  gcloud functions deploy krishnasagar-generate-voice \
  --runtime python39 \
  --trigger-resource krishnasagar-videos-processed \
  --trigger-event google.storage.object.finalize \
  --entry-point generate_audio \
  --memory 512MB \
  --region asia-south1 \
  --source cloud_functions/generate_audio

### generate_subtitles
  gcloud functions deploy krishnasagar-generate-subtitles \
  --runtime python39 \
  --trigger-resource krishnasagar-videos-processed \
  --trigger-event google.storage.object.finalize \
  --entry-point generate_subtitles \
  --memory 512MB \
  --region asia-south1 \
  --source cloud_functions/generate_subtitles

### Build the Docker Image
  gcloud builds submit --tag gcr.io/potent-airfoil-454402-e4/krishnasagar-video-merger cloud_run/merge_audio_video

### Deploy the Service

gcloud run deploy krishnasagar-video-merger \
  --image gcr.io/potent-airfoil-454402-e4/krishnasagar-video-merger \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated