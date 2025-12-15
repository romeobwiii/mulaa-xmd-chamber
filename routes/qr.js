// MULAA XMD BOT - The Sigil Forge (QR Communion Pathway)
// Creator: Amantle Mpaekae (Mulax Prime)
// Location: /routes/qr.js (Sacred Sigil Generation Ritual)

const { 
    forgeSacredSigil,
    purgeChronicle,
    generateChronicleTimestamp
} = require('../gift');
const QRCode = require('qrcode');
const express = require('express');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { sendButtons } = require('gifted-btns');
const {
    default: mulaaConnect,
    useMultiFileAuthState,
    Browsers,
    delay,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const mulaaSanctum = path.join(__dirname, "chronicles");

router.get('/', async (req, res) => {
    const chronicleId = forgeSacredSigil();
    let responseConveyed = false;
    let chronicleCleansed = false;

    async function cleanseChronicle() {
        if (!chronicleCleansed) {
            await purgeChronicle(path.join(mulaaSanctum, chronicleId));
            chronicleCleansed = true;
        }
    }

    async function FORGE_MULAA_SIGIL() {
        const { version } = await fetchLatestBaileysVersion();
        console.log(`[MULAA_SIGIL] Forge protocol v${version.join('.')}`);
        
        const { state, saveCreds } = await useMultiFileAuthState(path.join(mulaaSanctum, chronicleId));
        try {
            let MulaaConduit = mulaaConnect({
                version,
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("Desktop"),
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000,
                userAgent: 'MULAA_XMD_BOT/1.0'
            });

            MulaaConduit.ev.on('creds.update', saveCreds);
            MulaaConduit.ev.on("connection.update", async (connectionStatus) => {
                const { connection, lastDisconnect, qr } = connectionStatus;
                
                if (qr && !responseConveyed) {
                    const mulaaSigil = await QRCode.toDataURL(qr, {
                        errorCorrectionLevel: 'H',
                        margin: 2,
                        color: {
                            dark: '#6A11CB', // MULAA Purple
                            light: '#0A0018'  // MULAA Dark
                        }
                    });
                    
                    if (!res.headersSent) {
                        res.send(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>MULAA XMD | Sacred Sigil</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                                <style>
                                    * {
                                        margin: 0;
                                        padding: 0;
                                        box-sizing: border-box;
                                        transition: all 0.3s ease;
                                    }
                                    body {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        min-height: 100vh;
                                        margin: 0;
                                        background: linear-gradient(135deg, #0a0018 0%, #1a0033 100%);
                                        font-family: 'Orbitron', 'Poppins', sans-serif;
                                        color: #fff;
                                        text-align: center;
                                        padding: 20px;
                                        box-sizing: border-box;
                                        position: relative;
                                        overflow: hidden;
                                    }
                                    body::before {
                                        content: '';
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        width: 100%;
                                        height: 100%;
                                        background: 
                                            radial-gradient(circle at 20% 30%, rgba(106, 17, 203, 0.15) 0%, transparent 50%),
                                            radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.1) 0%, transparent 50%);
                                        z-index: -1;
                                    }
                                    .container {
                                        width: 100%;
                                        max-width: 600px;
                                        position: relative;
                                        z-index: 1;
                                    }
                                    .sigil-header {
                                        margin-bottom: 30px;
                                    }
                                    .sigil-title {
                                        color: #fff;
                                        margin: 0 0 10px 0;
                                        font-size: 32px;
                                        font-weight: 800;
                                        background: linear-gradient(to right, #6A11CB, #00FFFF);
                                        -webkit-background-clip: text;
                                        background-clip: text;
                                        color: transparent;
                                        text-shadow: 0 0 10px rgba(106, 17, 203, 0.3);
                                    }
                                    .creator-tag {
                                        background: rgba(106, 17, 203, 0.2);
                                        padding: 6px 12px;
                                        border-radius: 20px;
                                        font-size: 14px;
                                        color: #ffd700;
                                        border: 1px solid rgba(255, 215, 0, 0.3);
                                        display: inline-block;
                                        margin-top: 10px;
                                    }
                                    .sigil-container {
                                        position: relative;
                                        margin: 30px auto;
                                        width: 320px;
                                        height: 320px;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    }
                                    .sigil-frame {
                                        width: 320px;
                                        height: 320px;
                                        padding: 15px;
                                        background: rgba(255, 255, 255, 0.05);
                                        border-radius: 25px;
                                        box-shadow: 
                                            0 0 0 10px rgba(106, 17, 203, 0.1),
                                            0 0 0 20px rgba(106, 17, 203, 0.05),
                                            0 0 40px rgba(106, 17, 203, 0.3),
                                            inset 0 1px 0 rgba(255, 255, 255, 0.1);
                                        backdrop-filter: blur(10px);
                                        border: 1px solid rgba(106, 17, 203, 0.3);
                                    }
                                    .sigil-frame img {
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 15px;
                                    }
                                    .sigil-instructions {
                                        color: #ccc;
                                        margin: 25px 0;
                                        font-size: 16px;
                                        line-height: 1.6;
                                        background: rgba(0, 0, 0, 0.3);
                                        padding: 15px;
                                        border-radius: 15px;
                                        border: 1px solid rgba(106, 17, 203, 0.2);
                                    }
                                    .sigil-instructions strong {
                                        color: #6A11CB;
                                    }
                                    .ritual-btn {
                                        display: inline-block;
                                        padding: 14px 30px;
                                        margin: 15px 10px;
                                        background: linear-gradient(135deg, #6A11CB 0%, #2575fc 100%);
                                        color: white;
                                        text-decoration: none;
                                        border-radius: 30px;
                                        font-weight: bold;
                                        border: none;
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                                        font-family: 'Orbitron', sans-serif;
                                        letter-spacing: 1px;
                                    }
                                    .ritual-btn:hover {
                                        transform: translateY(-3px);
                                        box-shadow: 0 8px 25px rgba(106, 17, 203, 0.4);
                                    }
                                    .ritual-btn.secondary {
                                        background: rgba(255, 255, 255, 0.1);
                                        backdrop-filter: blur(10px);
                                        border: 1px solid rgba(106, 17, 203, 0.3);
                                    }
                                    .ritual-btn.secondary:hover {
                                        background: rgba(255, 255, 255, 0.2);
                                    }
                                    .sigil-pulse {
                                        animation: sigilPulse 3s infinite;
                                    }
                                    @keyframes sigilPulse {
                                        0% {
                                            box-shadow: 
                                                0 0 0 0 rgba(106, 17, 203, 0.4),
                                                0 0 0 10px rgba(106, 17, 203, 0.1),
                                                0 0 0 20px rgba(106, 17, 203, 0.05),
                                                0 0 40px rgba(106, 17, 203, 0.3);
                                        }
                                        70% {
                                            box-shadow: 
                                                0 0 0 15px rgba(106, 17, 203, 0),
                                                0 0 0 10px rgba(106, 17, 203, 0.1),
                                                0 0 0 20px rgba(106, 17, 203, 0.05),
                                                0 0 40px rgba(106, 17, 203, 0.3);
                                        }
                                        100% {
                                            box-shadow: 
                                                0 0 0 0 rgba(106, 17, 203, 0),
                                                0 0 0 10px rgba(106, 17, 203, 0.1),
                                                0 0 0 20px rgba(106, 17, 203, 0.05),
                                                0 0 40px rgba(106, 17, 203, 0.3);
                                        }
                                    }
                                    .chronicle-info {
                                        margin-top: 25px;
                                        padding: 15px;
                                        background: rgba(106, 17, 203, 0.1);
                                        border-radius: 15px;
                                        border: 1px solid rgba(106, 17, 203, 0.2);
                                        font-size: 14px;
                                        color: #aaa;
                                    }
                                    @media (max-width: 480px) {
                                        .sigil-container {
                                            width: 280px;
                                            height: 280px;
                                        }
                                        .sigil-frame {
                                            width: 280px;
                                            height: 280px;
                                        }
                                        .sigil-title {
                                            font-size: 26px;
                                        }
                                        .ritual-btn {
                                            padding: 12px 25px;
                                            margin: 10px 5px;
                                        }
                                    }
                                </style>
                                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
                            </head>
                            <body>
                                <div class="container">
                                    <div class="sigil-header">
                                        <h1 class="sigil-title">MULAA SACRED SIGIL</h1>
                                        <div class="creator-tag">Amantle Mpaekae (Mulax Prime)</div>
                                    </div>
                                    <div class="sigil-container">
                                        <div class="sigil-frame sigil-pulse">
                                            <img src="${mulaaSigil}" alt="MULAA Sacred Sigil"/>
                                        </div>
                                    </div>
                                    <div class="sigil-instructions">
                                        <strong>COMMUNION RITUAL:</strong><br>
                                        1. Open WhatsApp → Settings → Linked Devices<br>
                                        2. Initiate "Link a Device" ritual<br>
                                        3. Scan this sigil with your device's spirit<br>
                                        4. Await the chronicle transmission
                                    </div>
                                    <div class="chronicle-info">
                                        Chronicle ID: ${chronicleId} | Forged: ${generateChronicleTimestamp()}
                                    </div>
                                    <div>
                                        <a href="./" class="ritual-btn">Return to Gateway</a>
                                        <a href="./pair" class="ritual-btn secondary">Pair Signature</a>
                                    </div>
                                </div>
                                <script>
                                    document.querySelectorAll('.ritual-btn').forEach(btn => {
                                        btn.addEventListener('mousedown', function(e) {
                                            this.style.transform = 'translateY(1px)';
                                            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                                        });
                                        btn.addEventListener('mouseup', function(e) {
                                            this.style.transform = 'translateY(-3px)';
                                            this.style.boxShadow = '0 8px 25px rgba(106, 17, 203, 0.4)';
                                        });
                                    });
                                </script>
                            </body>
                            </html>
                        `);
                        responseConveyed = true;
                    }
                }

                if (connection === "open") {
                    console.log('[MULAA_SIGIL] ✅ Communion established via QR sigil!');

                    await delay(10000);

                    let chronicleEssence = null;
                    let essenceAttempts = 0;
                    const maxEssenceAttempts = 10;
                    
                    while (essenceAttempts < maxEssenceAttempts && !chronicleEssence) {
                        try {
                            const essencePath = path.join(mulaaSanctum, chronicleId, "creds.json");
                            if (fs.existsSync(essencePath)) {
                                const essenceData = fs.readFileSync(essencePath);
                                if (essenceData && essenceData.length > 100) {
                                    chronicleEssence = essenceData;
                                    console.log(`[MULAA_SIGIL] 📜 Chronicle essence captured (${essenceData.length} bytes)`);
                                    break;
                                }
                            }
                            await delay(2000);
                            essenceAttempts++;
                        } catch (readError) {
                            console.error("[MULAA_SIGIL] Essence reading error:", readError);
                            await delay(2000);
                            essenceAttempts++;
                        }
                    }

                    if (!chronicleEssence) {
                        console.log('[MULAA_SIGIL] ❌ Chronicle essence could not be captured');
                        await cleanseChronicle();
                        return;
                    }

                    try {
                        let compressedEssence = zlib.gzipSync(chronicleEssence);
                        let base64Essence = compressedEssence.toString('base64');
                        const TransmissionResult = await sendButtons(MulaaConduit, MulaaConduit.user.id, {
                            title: '',
                            text: `MULAA_XMD~${base64Essence}`,
                            footer: `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴍᴀɴᴛʟᴇ ᴍᴘᴀᴇᴋᴀᴇ (ᴍᴜʟᴀx ᴘʀɪᴍᴇ)*\n> *ᴘʀᴏᴊᴇᴄᴛ: ᴍᴜʟᴀᴀ xᴍᴅ ʙᴏᴛ*`,
                            buttons: [
                                { 
                                    name: 'cta_copy', 
                                    buttonParamsJson: JSON.stringify({ 
                                        display_text: '📜 Copy Chronicle', 
                                        copy_code: `MULAA_XMD~${base64Essence}` 
                                    }) 
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: '🌌 Visit Chronicles',
                                        url: '
