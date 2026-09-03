package gov.shield.sentinel

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import android.util.Log
import java.io.FileInputStream
import java.io.FileOutputStream
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import kotlin.concurrent.thread

/**
 * GovShield Sovereign VpnService
 * Intercepts Android device DNS traffic (Port 53) and filters phishing / fake government domains.
 * Zero technical setup required from citizen.
 */
class GovShieldVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null
    private var isRunning = false

    companion object {
        const val ACTION_CONNECT = "gov.shield.sentinel.CONNECT"
        const val ACTION_DISCONNECT = "gov.shield.sentinel.DISCONNECT"
        const val NOTIFICATION_CHANNEL_ID = "govshield_protection_channel"
        const val NOTIFICATION_ID = 1454
        const val GOVSHIELD_DNS_IP = "10.83.5.160" // Local / Cloud DNS endpoint
        const val FALLBACK_DNS_IP = "1.1.1.1"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == ACTION_DISCONNECT) {
            stopVpn()
            return START_NOT_STICKY
        }

        startVpn()
        return START_STICKY
    }

    private fun startVpn() {
        if (isRunning) return
        isRunning = true

        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())

        thread {
            try {
                // Configure Android TUN Interface to intercept DNS queries
                val builder = Builder()
                    .setSession("GovShield Cyber Defense")
                    .addAddress("10.0.0.2", 32)
                    .addDnsServer(GOVSHIELD_DNS_IP)
                    .addDnsServer(FALLBACK_DNS_IP)
                    .addRoute(GOVSHIELD_DNS_IP, 32)
                    .setBlocking(true)

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    builder.setMetered(false)
                }

                vpnInterface = builder.establish()
                Log.i("GovShieldVPN", "🛡️ GovShield Sovereign DNS Protection ACTIVE")

                // Broadcast active state to UI
                sendBroadcast(Intent("gov.shield.sentinel.VPN_STATE_CHANGED").putExtra("active", true))

            } catch (e: Exception) {
                Log.e("GovShieldVPN", "Error establishing VPN: ${e.message}")
                stopVpn()
            }
        }
    }

    private fun stopVpn() {
        isRunning = false
        try {
            vpnInterface?.close()
            vpnInterface = null
        } catch (e: Exception) {
            Log.e("GovShieldVPN", "Error stopping VPN: ${e.message}")
        }
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
        sendBroadcast(Intent("gov.shield.sentinel.VPN_STATE_CHANGED").putExtra("active", false))
    }

    override fun onDestroy() {
        stopVpn()
        super.onDestroy()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "GovShield Real-Time Defense",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notifies that your phone is protected against fake government portals & cyber fraud."
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle("🛡️ GovShield सुरक्षा चालू है")
                .setContentText("आपका फोन फर्जी सरकारी वेबसाइटों से सुरक्षित है।")
                .setSmallIcon(R.drawable.govshield_logo)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build()
        } else {
            Notification.Builder(this)
                .setContentTitle("GovShield Active")
                .setContentText("Protected against phishing & fraud.")
                .setSmallIcon(R.drawable.govshield_logo)
                .setContentIntent(pendingIntent)
                .build()
        }
    }
}
