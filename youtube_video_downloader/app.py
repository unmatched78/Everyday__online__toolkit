import os
from yt_dlp import YoutubeDL

class YouTubeDownloader:
    """
    A toolkit for downloading YouTube content:
      - download_audio: Extracts and converts to MP3.
      - download_video: Downloads up to specified resolution MP4.
    """

    def __init__(self, download_dir: str = "downloads"):
        self.download_dir = download_dir
        os.makedirs(self.download_dir, exist_ok=True)

    def download_audio(self, url: str, codec: str = "mp3", quality: str = "192"):
        """
        Download the best audio and convert to given codec/bitrate.
        :param url: YouTube video URL
        :param codec: 'mp3', 'aac', etc.
        :param quality: bitrate (e.g., '192')
        """
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": os.path.join(self.download_dir, "%(title)s.%(ext)s"),
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": codec,
                    "preferredquality": quality,
                }
            ],
            "quiet": False,
            "no_warnings": True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            print(f"Downloaded and converted: {info['title']}.{codec}")

    def download_video(self, url: str, resolution: int = 1080):
        """
        Download video up to the specified resolution and merge with audio.
        :param url: YouTube video URL
        :param resolution: max video height (e.g., 1080)
        """
        # e.g., 'bestvideo[height<=1080]+bestaudio/best'
        fmt = f"bestvideo[height<={resolution}]+bestaudio/best"
        ydl_opts = {
            "format": fmt,
            "outtmpl": os.path.join(self.download_dir, "%(title)s.%(ext)s"),
            "merge_output_format": "mp4",
            "quiet": False,
            "no_warnings": True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            print(f"Downloaded video: {info['title']}.mp4")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="YouTube Downloader: audio or video."
    )
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument(
        "--mode", choices=["audio", "video"], default="audio",
        help="Download mode: audio or video"
    )
    parser.add_argument(
        "--codec", default="mp3",
        help="Audio codec (mp3, aac, etc.)"
    )
    parser.add_argument(
        "--quality", default="192",
        help="Audio bitrate for conversion"
    )
    parser.add_argument(
        "--resolution", type=int, default=1080,
        help="Max video height for download"
    )
    args = parser.parse_args()

    dl = YouTubeDownloader()
    if args.mode == "audio":
        dl.download_audio(args.url, codec=args.codec, quality=args.quality)
    else:
        dl.download_video(args.url, resolution=args.resolution)
