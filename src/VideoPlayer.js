import React, { useState, useEffect, useRef } from "react"
import Hls from "hls.js"

const VideoPlayer = ({ src, poster }) => {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [qualities, setQualities] = useState([])
    const [selectedQuality, setSelectedQuality] = useState(null)

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls()
            videoRef.current.hls = hls
            hls.loadSource(src)
            hls.attachMedia(videoRef.current)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setQualities(hls.levels.map((level) => level.height))
                setSelectedQuality(hls.levels.length - 1)
                setIsPlaying(true)
            })
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = src
            setIsPlaying(true)
        }
    }, [src])

    useEffect(() => {
        if (isPlaying) {
            videoRef.current.play()
        } else {
            videoRef.current.pause()
        }
    }, [isPlaying])

    const handleQualityChange = (event) => {
        const newQuality = parseInt(event.target.value)
        setSelectedQuality(newQuality)
        const video = videoRef.current

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const hls = video.hls

            if (hls && hls.levels[newQuality]) {
                hls.currentLevel = newQuality
            }
        }
    }

    return (
        <div>
            <video
                width="600"
                height="600"
                ref={videoRef}
                poster={poster}
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            {qualities.length > 0 && (
                <select value={selectedQuality} onChange={handleQualityChange}>
                    {qualities.map((quality, index) => (
                        <option key={index} value={index}>
                            {quality}p
                        </option>
                    ))}
                </select>
            )}
        </div>
    )
}

export default VideoPlayer
