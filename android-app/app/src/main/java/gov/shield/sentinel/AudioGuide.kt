package gov.shield.sentinel

import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

/**
 * Multilingual Spoken Voice Guidance for Illiterate & Visually Challenged Citizens
 */
class AudioGuide(context: Context, onReady: (() -> Unit)? = null) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = TextToSpeech(context, this)
    private var isReady = false
    private var currentLangCode = "hi"

    private val voicePrompts = mapOf(
        "hi" to mapOf(
            "welcome" to "नमस्ते! अपने फोन को फर्जी सरकारी वेबसाइटों और साइबर फ्रॉड से बचाने के लिए स्क्रीन पर दिख रहे बड़े शील्ड बटन को दबाएं।",
            "activated" to "GovShield सुरक्षा चालू हो गई है। अब आपका फोन सुरक्षित है।",
            "deactivated" to "सुरक्षा बंद कर दी गई है। सुरक्षित रहने के लिए इसे दोबारा चालू करें।",
            "helpline" to "साइबर हेल्पलाइन 1930 पर कॉल की जा रही है।"
        ),
        "en" to mapOf(
            "welcome" to "Welcome to GovShield. Tap the big shield button in the center to protect your phone from fake government websites and online fraud.",
            "activated" to "GovShield protection is now active. Your phone is secured.",
            "deactivated" to "Protection is turned off. Tap again to stay protected.",
            "helpline" to "Calling National Cyber Crime Helpline 1930."
        ),
        "bn" to mapOf(
            "welcome" to "নমস্কার! ভুয়ো সরকারি ওয়েবসাইট থেকে সুরক্ষা পেতে মাঝের বড় শিল্ড বোতামটি টিপুন।",
            "activated" to "সুরক্ষা চালু হয়েছে। আপনার ফোন এখন নিরাপদ।",
            "deactivated" to "সুরক্ষা বন্ধ করা হয়েছে।",
            "helpline" to "১৯৩০ সাইবার হেল্পলাইনে কল করা হচ্ছে।"
        ),
        "ta" to mapOf(
            "welcome" to "வணக்கம்! போலி அரசு வலைத்தளங்களிலிருந்து பாதுகாக்க நடுவில் உள்ள பெரிய ஷீல்ட் பொத்தானை அழுத்தவும்.",
            "activated" to "பாதுகாப்பு இயக்கப்பட்டது. உங்கள் தொலைபேசி இப்போது பாதுகாப்பாக உள்ளது.",
            "deactivated" to "பாதுகாப்பு நிறுத்தப்பட்டது.",
            "helpline" to "1930 உதவி எண்ணிற்கு அழைக்கப்படுகிறது."
        ),
        "te" to mapOf(
            "welcome" to "నమస్కారం! నకిలీ ప్రభుత్వ వెబ్‌సైట్ల నుండి రక్షణ కోసం మధ్యలో ఉన్న పెద్ద షీల్డ్ బటన్‌ను నొక్కండి.",
            "activated" to "రక్షణ ప్రారంభమైంది. మీ ఫోన్ ఇప్పుడు సురక్షితం.",
            "deactivated" to "రక్షణ నిలిపివేయబడింది.",
            "helpline" to "1930 హెల్ప్‌లైన్‌కు కాల్ చేస్తోంది."
        ),
        "mr" to mapOf(
            "welcome" to "नमस्कार! बनावट सरकारी संकेतस्थळांपासून संरक्षणासाठी स्क्रीनवरील मोठ्या शील्ड बटनावर टॅप करा.",
            "activated" to "संरक्षण सुरू झाले आहे. आपला फोन आता सुरक्षित आहे.",
            "deactivated" to "संरक्षण बंद केले आहे.",
            "helpline" to "१९३० सायबर हेल्पलाइनवर कॉल करत आहे."
        )
    )

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isReady = true
            setLanguage(currentLangCode)
        } else {
            Log.e("AudioGuide", "TTS Init failed")
        }
    }

    fun setLanguage(langCode: String) {
        currentLangCode = langCode
        if (!isReady) return

        val locale = when (langCode) {
            "hi" -> Locale("hi", "IN")
            "bn" -> Locale("bn", "IN")
            "ta" -> Locale("ta", "IN")
            "te" -> Locale("te", "IN")
            "mr" -> Locale("mr", "IN")
            else -> Locale.ENGLISH
        }
        tts?.language = locale
    }

    fun speak(key: String) {
        if (!isReady) return
        val prompts = voicePrompts[currentLangCode] ?: voicePrompts["hi"]!!
        val text = prompts[key] ?: return
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "govshield_voice_$key")
    }

    fun stop() {
        tts?.stop()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
    }
}
