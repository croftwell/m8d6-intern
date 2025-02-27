from flask import Flask, render_template, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)

def get_video_id(url):
    """YouTube URL'sinden video ID'sini çıkarır"""
    parsed_url = urlparse(url)
    if parsed_url.hostname == 'youtu.be':
        return parsed_url.path[1:]
    if parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query).get('v', [None])[0]
    return None

@app.route('/')
def index():
    return render_template('index.html')  



@app.route('/api/transcript')
def transcript():
    video_id = request.args.get('videoId')
    language = request.args.get('language')
    include_timestamps = request.args.get('includeTimestamps', 'false').lower() == 'true'

    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])

        if include_timestamps:
            
            transcript_text = "\n".join([f"[{entry['start']:.2f}s] {entry['text']}" for entry in transcript_list])
        else:
           
            transcript_text = " ".join([entry['text'] for entry in transcript_list])

        return jsonify({'transcript': transcript_text})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True)
