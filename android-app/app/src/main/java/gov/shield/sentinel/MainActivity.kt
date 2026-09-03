package gov.shield.sentinel

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.net.VpnService
import android.os.Bundle
import android.view.animation.Animation
import android.view.animation.ScaleAnimation
import android.widget.*

/**
 * GovShield Citizen Mobile Activity
 * Solo On-Device 1-Tap Activation
 */
class MainActivity : Activity() {

    private var isProtected = false
    private val VPN_REQUEST_CODE = 1454

    private lateinit var btnBigShield: LinearLayout
    private lateinit var txtShieldIcon: TextView
    private lateinit var txtShieldStatus: TextView
    private lateinit var txtShieldSub: TextView
    private lateinit var txtStatusDesc: TextView
    private lateinit var viewPulseRing: View

    private val vpnStateReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val active = intent?.getBooleanExtra("active", false) ?: false
            updateUiState(active)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnBigShield = findViewById(R.id.btnBigShield)
        txtShieldIcon = findViewById(R.id.txtShieldIcon)
        txtShieldStatus = findViewById(R.id.txtShieldStatus)
        txtShieldSub = findViewById(R.id.txtShieldSub)
        txtStatusDesc = findViewById(R.id.txtStatusDesc)
        viewPulseRing = findViewById(R.id.viewPulseRing)

        setupShieldGraphics()
        setupListeners()

        registerReceiver(vpnStateReceiver, IntentFilter("gov.shield.sentinel.VPN_STATE_CHANGED"))
    }

    private fun setupShieldGraphics() {
        val shieldBg = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(Color.parseColor("#5C3CF6"))
        }
        btnBigShield.background = shieldBg

        val ringBg = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(Color.parseColor("#EDE9FE"))
        }
        viewPulseRing.background = ringBg

        startPulseAnimation()
    }

    private fun startPulseAnimation() {
        val pulse = ScaleAnimation(
            1f, 1.15f, 1f, 1.15f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        ).apply {
            duration = 1200
            repeatCount = Animation.INFINITE
            repeatMode = Animation.REVERSE
        }
        viewPulseRing.startAnimation(pulse)
    }

    private fun setupListeners() {
        // 1-Tap Giant Shield Button
        btnBigShield.setOnClickListener {
            if (isProtected) {
                // Deactivate
                val intent = Intent(this, GovShieldVpnService::class.java).apply {
                    action = GovShieldVpnService.ACTION_DISCONNECT
                }
                startService(intent)
            } else {
                // Activate Solo On-Device VpnService
                val vpnIntent = VpnService.prepare(this)
                if (vpnIntent != null) {
                    startActivityForResult(vpnIntent, VPN_REQUEST_CODE)
                } else {
                    onActivityResult(VPN_REQUEST_CODE, RESULT_OK, null)
                }
            }
        }

        // 1930 Helpline Call
        findViewById<Button>(R.id.btnHelpline1930).setOnClickListener {
            val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:1930"))
            startActivity(callIntent)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == VPN_REQUEST_CODE && resultCode == RESULT_OK) {
            val intent = Intent(this, GovShieldVpnService::class.java).apply {
                action = GovShieldVpnService.ACTION_CONNECT
            }
            startService(intent)
        }
    }

    private fun updateUiState(active: Boolean) {
        isProtected = active
        val shieldBg = GradientDrawable().apply {
            shape = GradientDrawable.OVAL
            setColor(if (active) Color.parseColor("#00875A") else Color.parseColor("#5C3CF6"))
        }
        btnBigShield.background = shieldBg

        if (active) {
            txtShieldIcon.text = "✅"
            txtShieldStatus.text = "सुरक्षित"
            txtShieldSub.text = "GovShield DNS सक्रिय"
            txtStatusDesc.text = "🛡️ सुरक्षा सक्रिय है! आपका फोन अब फर्जी सरकारी वेबसाइटों और साइबर फ्रॉड से सुरक्षित है।"
        } else {
            txtShieldIcon.text = "🛡️"
            txtShieldStatus.text = "टैप करें"
            txtShieldSub.text = "सुरक्षा चालू करें"
            txtStatusDesc.text = "बड़े शील्ड बटन को दबाकर सुरक्षा चालू करें।"
        }
    }

    override fun onDestroy() {
        unregisterReceiver(vpnStateReceiver)
        super.onDestroy()
    }
}
