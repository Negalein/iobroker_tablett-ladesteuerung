/*
 ********************************************************************
 * TABLET LADESTEUERUNG V2 DELUXE
 *
 * 2 Tablets + 2 Shelly Steckdosen
 *
 * Funktionen:
 *
 * - Automatische Ladesteuerung
 * - Laden EIN bei MinAkku
 * - Laden AUS bei MaxAkku
 * - 3 Betriebsarten:
 *      Automatik
 *      Manuell EIN
 *      Manuell AUS
 *
 * - VIS Steuerung
 * - Ladezeit
 * - Letzte Ladezeit
 * - Ladezyklen
 * - Kritischer Akku
 *
 * - Telegram Benachrichtigung
 * - WhatsApp Benachrichtigung
 *
 * Datenpunkte:
 *
 * 0_userdata.0.TabletLadung
 *
 ********************************************************************
 */


// ===================================================================
// KONFIGURATION
// ===================================================================


// -------------------------------------------------------------------
// TELEGRAM
// -------------------------------------------------------------------

const TELEGRAM_INSTANCE = "telegram.0";
const CHAT_ID = 630041062;


// -------------------------------------------------------------------
// WHATSAPP
// -------------------------------------------------------------------

const WHATSAPP_DP = "whatsapp-cmb.0.sendMessage";


// -------------------------------------------------------------------
// BASISPFAD
// -------------------------------------------------------------------

const BASE = "0_userdata.0.TabletLadung";


// -------------------------------------------------------------------
// TABLETS
// -------------------------------------------------------------------

const TABLETS = [

    {
        name: "Tablet_Nega",
        displayName: "Tablet Nega",

        batteryDP:
            "fullybrowser.0.Tablet-Nega.Info.batteryLevel",

        shellyDP:
            "shelly.0.shellyplusplugs#64b7080c4f74#1.Relay0.Switch"
    },


    {
        name: "Tablet_Nega_2",
        displayName: "Tablet Nega 2",

        batteryDP:
            "fullybrowser.0.Tablet-Nega_2.Info.batteryLevel",

        shellyDP:
            "shelly.1.SHPLG-S#C38331#1.Relay0.Switch"
    }

];


// ===================================================================
// TELEGRAM NACHRICHT
// ===================================================================

function sendTgText(text) {

    if (!text) return;

    sendTo(
        TELEGRAM_INSTANCE,
        "send",
        {
            text: text,
            chatId: CHAT_ID
        }
    );

}


// ===================================================================
// WHATSAPP NACHRICHT
// ===================================================================

function sendWhatsappText(text) {

    if (!text) return;

    setState(
        WHATSAPP_DP,
        text,
        false
    );

}


// ===================================================================
// ZENTRALE BENACHRICHTIGUNG
// ===================================================================

function sendNotification(text) {

    if (!text) return;


    // Telegram aktiv?

    const telegramEnabled =
        getState(BASE + ".Benachrichtigungen.Telegram");


    if (
        !telegramEnabled ||
        telegramEnabled.val
    ) {

        sendTgText(text);

    }


    // WhatsApp aktiv?

    const whatsappEnabled =
        getState(BASE + ".Benachrichtigungen.WhatsApp");


    if (
        !whatsappEnabled ||
        whatsappEnabled.val
    ) {

        sendWhatsappText(text);

    }


    log(
        "[Tablet-Ladesteuerung] Nachricht gesendet: " +
        text.replace(/\n/g, " | "),
        "info"
    );

}


// ===================================================================
// DATUM FORMATIEREN
// ===================================================================

function formatDate(timestamp) {

    if (!timestamp) return "-";

    const date = new Date(timestamp);


    const day =
        String(date.getDate()).padStart(2, "0");

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const year =
        date.getFullYear();


    const hour =
        String(date.getHours()).padStart(2, "0");

    const minute =
        String(date.getMinutes()).padStart(2, "0");


    return (
        day + "." +
        month + "." +
        year + " " +
        hour + ":" +
        minute
    );

}


// ===================================================================
// ZEIT FORMATIEREN
// ===================================================================

function formatDuration(seconds) {

    seconds = Math.floor(seconds);


    if (seconds < 0) {

        seconds = 0;

    }


    const hours =
        Math.floor(seconds / 3600);


    const minutes =
        Math.floor(
            (seconds % 3600) / 60
        );


    const secs =
        seconds % 60;


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


// ===================================================================
// DATENPUNKTE ERSTELLEN
// ===================================================================

function createTabletStates(tablet) {


    const base =
        BASE + "." + tablet.name;


    // ---------------------------------------------------------------
    // BETRIEBSART
    // ---------------------------------------------------------------

    tablet.modeDP =
        base + ".Betriebsart";


    createState(
        tablet.modeDP,
        "Automatik",
        {
            name: "Betriebsart",
            type: "string",
            role: "text",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // MIN AKKU
    // ---------------------------------------------------------------

    tablet.minBatteryDP =
        base + ".MinAkku";


    createState(
        tablet.minBatteryDP,
        20,
        {
            name: "Laden einschalten bei",
            type: "number",
            role: "value",
            unit: "%",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // MAX AKKU
    // ---------------------------------------------------------------

    tablet.maxBatteryDP =
        base + ".MaxAkku";


    createState(
        tablet.maxBatteryDP,
        80,
        {
            name: "Laden ausschalten bei",
            type: "number",
            role: "value",
            unit: "%",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // KRITISCHER AKKU
    // ---------------------------------------------------------------

    tablet.criticalBatteryDP =
        base + ".KritischAkku";


    createState(
        tablet.criticalBatteryDP,
        10,
        {
            name: "Kritischer Akkustand",
            type: "number",
            role: "value",
            unit: "%",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // AKTUELLER AKKU
    // ---------------------------------------------------------------

    tablet.batteryDisplayDP =
        base + ".Akku";


    createState(
        tablet.batteryDisplayDP,
        0,
        {
            name: "Aktueller Akkustand",
            type: "number",
            role: "value",
            unit: "%",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // STECKDOSE
    // ---------------------------------------------------------------

    tablet.socketDP =
        base + ".Steckdose";


    createState(
        tablet.socketDP,
        false,
        {
            name: "Steckdose",
            type: "boolean",
            role: "indicator",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // LÄDT
    // ---------------------------------------------------------------

    tablet.chargingDP =
        base + ".Laedt";


    createState(
        tablet.chargingDP,
        false,
        {
            name: "Tablet wird geladen",
            type: "boolean",
            role: "indicator",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // STATUS
    // ---------------------------------------------------------------

    tablet.statusDP =
        base + ".Status";


    createState(
        tablet.statusDP,
        "",
        {
            name: "Status",
            type: "string",
            role: "text",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // AKTUELLE LADEZEIT
    // ---------------------------------------------------------------

    tablet.currentChargeTimeDP =
        base + ".AktuelleLadezeit";


    createState(
        tablet.currentChargeTimeDP,
        "00:00:00",
        {
            name: "Aktuelle Ladezeit",
            type: "string",
            role: "text",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // LETZTE LADEZEIT
    // ---------------------------------------------------------------

    tablet.lastChargeTimeDP =
        base + ".LetzteLadezeit";


    createState(
        tablet.lastChargeTimeDP,
        "00:00:00",
        {
            name: "Letzte Ladezeit",
            type: "string",
            role: "text",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // LADEZYKLEN
    // ---------------------------------------------------------------

    tablet.chargeCyclesDP =
        base + ".Ladezyklen";


    createState(
        tablet.chargeCyclesDP,
        0,
        {
            name: "Anzahl Ladevorgänge",
            type: "number",
            role: "value",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // LETZTER LADESTART
    // ---------------------------------------------------------------

    tablet.lastChargeStartDP =
        base + ".LetzterLadebeginn";


    createState(
        tablet.lastChargeStartDP,
        "",
        {
            name: "Letzter Ladebeginn",
            type: "string",
            role: "text",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // LETZTES LADEENDE
    // ---------------------------------------------------------------

    tablet.lastChargeEndDP =
        base + ".LetztesLadeende";


    createState(
        tablet.lastChargeEndDP,
        "",
        {
            name: "Letztes Ladeende",
            type: "string",
            role: "text",
            read: true,
            write: false
        }
    );


    // ---------------------------------------------------------------
    // MANUELLER LADESTART
    // ---------------------------------------------------------------

    tablet.manualOnDP =
        base + ".ManuellEin";


    createState(
        tablet.manualOnDP,
        false,
        {
            name: "Manuell Laden EIN",
            type: "boolean",
            role: "button",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // MANUELLES AUSSCHALTEN
    // ---------------------------------------------------------------

    tablet.manualOffDP =
        base + ".ManuellAus";


    createState(
        tablet.manualOffDP,
        false,
        {
            name: "Manuell Laden AUS",
            type: "boolean",
            role: "button",
            read: true,
            write: true
        }
    );


    // ---------------------------------------------------------------
    // RESET LADEZYKLEN
    // ---------------------------------------------------------------

    tablet.resetCyclesDP =
        base + ".LadezyklenReset";


    createState(
        tablet.resetCyclesDP,
        false,
        {
            name: "Ladezyklen zurücksetzen",
            type: "boolean",
            role: "button",
            read: true,
            write: true
        }
    );

}


// ===================================================================
// GLOBALE DATENPUNKTE
// ===================================================================

function createGlobalStates() {


    // Telegram

    createState(
        BASE + ".Benachrichtigungen.Telegram",
        true,
        {
            name: "Telegram Benachrichtigungen",
            type: "boolean",
            role: "switch",
            read: true,
            write: true
        }
    );


    // WhatsApp

    createState(
        BASE + ".Benachrichtigungen.WhatsApp",
        true,
        {
            name: "WhatsApp Benachrichtigungen",
            type: "boolean",
            role: "switch",
            read: true,
            write: true
        }
    );

}


// ===================================================================
// STATUS SETZEN
// ===================================================================

function setTabletStatus(tablet, text) {

    setState(
        tablet.statusDP,
        text,
        true
    );


    log(
        "[" +
        tablet.displayName +
        "] " +
        text,
        "info"
    );

}


// ===================================================================
// LADEZEIT AKTUALISIEREN
// ===================================================================

function updateChargeTime(tablet) {


    const shellyState =
        getState(tablet.shellyDP);


    if (
        !shellyState ||
        !shellyState.val
    ) {

        setState(
            tablet.currentChargeTimeDP,
            "00:00:00",
            true
        );

        return;

    }


    // Zeitpunkt der letzten Zustandsänderung
    // des Shelly verwenden

    const startTime =
        shellyState.lc;


    if (!startTime) {

        return;

    }


    const seconds =
        (Date.now() - startTime) / 1000;


    setState(
        tablet.currentChargeTimeDP,
        formatDuration(seconds),
        true
    );

}


// ===================================================================
// LADEVORGANG GESTARTET
// ===================================================================

function chargeStarted(tablet) {


    const batteryState =
        getState(tablet.batteryDP);


    const battery =
        batteryState ?
        Number(batteryState.val) :
        0;


    // Ladezyklen erhöhen

    const cycleState =
        getState(tablet.chargeCyclesDP);


    let cycles = 0;


    if (cycleState) {

        cycles =
            Number(cycleState.val);

    }


    cycles++;


    setState(
        tablet.chargeCyclesDP,
        cycles,
        true
    );


    // Startzeit speichern

    const now =
        Date.now();


    tablet.chargeStartTime =
        now;


    setState(
        tablet.lastChargeStartDP,
        formatDate(now),
        true
    );


    setState(
        tablet.currentChargeTimeDP,
        "00:00:00",
        true
    );


    // Benachrichtigung

    sendNotification(

        "⚡ Ladevorgang gestartet\n\n" +

        "📱 " +
        tablet.displayName +
        "\n" +

        "🔋 Akku: " +
        battery +
        "%\n" +

        "🔄 Ladezyklus: " +
        cycles

    );

}


// ===================================================================
// LADEVORGANG BEENDET
// ===================================================================

function chargeStopped(tablet) {


    let startTime =
        tablet.chargeStartTime;


    // Falls das Script während des Ladens neu gestartet wurde
    // nehmen wir die lc-Zeit des Shelly.

    if (!startTime) {

        const shellyState =
            getState(tablet.shellyDP);

        if (shellyState) {

            startTime =
                shellyState.lc;

        }

    }


    let duration =
        0;


    if (startTime) {

        duration =
            (Date.now() - startTime) / 1000;

    }


    const durationText =
        formatDuration(duration);


    setState(
        tablet.lastChargeTimeDP,
        durationText,
        true
    );


    setState(
        tablet.currentChargeTimeDP,
        "00:00:00",
        true
    );


    const now =
        Date.now();


    setState(
        tablet.lastChargeEndDP,
        formatDate(now),
        true
    );


    tablet.chargeStartTime =
        null;

}


// ===================================================================
// TABLET PRÜFEN
// ===================================================================

function checkTablet(tablet) {


    // ---------------------------------------------------------------
    // DATEN LESEN
    // ---------------------------------------------------------------

    const batteryState =
        getState(tablet.batteryDP);


    const shellyState =
        getState(tablet.shellyDP);


    const modeState =
        getState(tablet.modeDP);


    const minState =
        getState(tablet.minBatteryDP);


    const maxState =
        getState(tablet.maxBatteryDP);


    const criticalState =
        getState(tablet.criticalBatteryDP);


    // ---------------------------------------------------------------
    // AKKUSTAND PRÜFEN
    // ---------------------------------------------------------------

    if (
        !batteryState ||
        batteryState.val === null ||
        batteryState.val === undefined
    ) {

        setTabletStatus(
            tablet,
            "Fehler: Kein Akkustand verfügbar"
        );

        return;

    }


    const battery =
        Number(batteryState.val);


    const shelly =
        shellyState ?
        shellyState.val :
        false;


    const mode =
        modeState ?
        modeState.val :
        "Automatik";


    const minBattery =
        minState ?
        Number(minState.val) :
        20;


    const maxBattery =
        maxState ?
        Number(maxState.val) :
        80;


    const criticalBattery =
        criticalState ?
        Number(criticalState.val) :
        10;


    // ---------------------------------------------------------------
    // VIS AKKU
    // ---------------------------------------------------------------

    setState(
        tablet.batteryDisplayDP,
        battery,
        true
    );


    // ---------------------------------------------------------------
    // STECKDOSENSTATUS
    // ---------------------------------------------------------------

    setState(
        tablet.socketDP,
        shelly,
        true
    );


    // ---------------------------------------------------------------
    // LADESTATUS
    // ---------------------------------------------------------------

    setState(
        tablet.chargingDP,
        shelly,
        true
    );


    // ---------------------------------------------------------------
    // GRENZWERTE PRÜFEN
    // ---------------------------------------------------------------

    if (minBattery >= maxBattery) {

        setTabletStatus(
            tablet,
            "Fehler: MinAkku muss kleiner als MaxAkku sein"
        );

        return;

    }


    // ===============================================================
    // KRITISCHER AKKU
    // ===============================================================

    if (battery <= criticalBattery) {


        // Nur einmal benachrichtigen

        if (!tablet.criticalNotified) {

            tablet.criticalNotified =
                true;


            sendNotification(

                "🚨 AKKU KRITISCH!\n\n" +

                "📱 " +
                tablet.displayName +
                "\n" +

                "🔋 Akku: " +
                battery +
                "%"

            );

        }

    }


    // Sobald der Akku wieder deutlich über dem kritischen Wert ist,
    // darf später erneut eine Warnung gesendet werden.

    if (battery > criticalBattery + 2) {

        tablet.criticalNotified =
            false;

    }


    // ===============================================================
    // MANUELL EIN
    // ===============================================================

    if (mode === "Manuell EIN") {


        if (!shelly) {

            setState(
                tablet.shellyDP,
                true,
                false
            );

        }


        setTabletStatus(
            tablet,
            "Manuell EIN | Akku: " +
            battery +
            "%"
        );


        return;

    }


    // ===============================================================
    // MANUELL AUS
    // ===============================================================

    if (mode === "Manuell AUS") {


        if (shelly) {

            setState(
                tablet.shellyDP,
                false,
                false
            );

        }


        setTabletStatus(
            tablet,
            "Manuell AUS | Akku: " +
            battery +
            "%"
        );


        return;

    }


    // ===============================================================
    // AUTOMATIK
    // ===============================================================


    // ---------------------------------------------------------------
    // AKKU NIEDRIG
    // ---------------------------------------------------------------

    if (battery <= minBattery) {


        if (!shelly) {


            log(
                "[" +
                tablet.displayName +
                "] Automatik: Laden EIN",
                "info"
            );


            setState(
                tablet.shellyDP,
                true,
                false
            );

        }


        setTabletStatus(
            tablet,
            "Automatik: Laedt | Akku: " +
            battery +
            "%"
        );


        return;

    }


    // ---------------------------------------------------------------
    // LADEZIEL ERREICHT
    // ---------------------------------------------------------------

    if (battery >= maxBattery) {


        if (shelly) {


            log(
                "[" +
                tablet.displayName +
                "] Automatik: Ladeziel erreicht",
                "info"
            );


            setState(
                tablet.shellyDP,
                false,
                false
            );

        }


        setTabletStatus(
            tablet,
            "Ladeziel erreicht | Akku: " +
            battery +
            "%"
        );


        return;

    }


    // ---------------------------------------------------------------
    // ZWISCHEN MIN UND MAX
    // ---------------------------------------------------------------

    if (shelly) {


        setTabletStatus(
            tablet,
            "Laedt | Akku: " +
            battery +
            "%"
        );

    }

    else {


        setTabletStatus(
            tablet,
            "Akku OK | " +
            battery +
            "%"
        );

    }

}


// ===================================================================
// SHELLY STATUS GEÄNDERT
// ===================================================================

function shellyChanged(tablet, obj) {


    const newState =
        obj.state.val;


    const oldState =
        obj.oldState ?
        obj.oldState.val :
        null;


    // ---------------------------------------------------------------
    // VIS AKTUALISIEREN
    // ---------------------------------------------------------------

    setState(
        tablet.socketDP,
        newState,
        true
    );


    setState(
        tablet.chargingDP,
        newState,
        true
    );


    // ---------------------------------------------------------------
    // EINGESCHALTET
    // ---------------------------------------------------------------

    if (
        newState === true &&
        oldState === false
    ) {


        chargeStarted(tablet);

    }


    // ---------------------------------------------------------------
    // AUSGESCHALTET
    // ---------------------------------------------------------------

    if (
        newState === false &&
        oldState === true
    ) {


        chargeStopped(tablet);


        // Nur Benachrichtigung wenn im Automatikbetrieb
        // das Ladeziel erreicht wurde.

        const modeState =
            getState(tablet.modeDP);


        const batteryState =
            getState(tablet.batteryDP);


        const maxState =
            getState(tablet.maxBatteryDP);


        if (
            modeState &&
            batteryState &&
            maxState &&
            modeState.val === "Automatik" &&
            Number(batteryState.val) >=
            Number(maxState.val)
        ) {


            sendNotification(

                "✅ Ladeziel erreicht\n\n" +

                "📱 " +
                tablet.displayName +
                "\n" +

                "🔋 Akku: " +
                batteryState.val +
                "%\n" +

                "🔌 Ladegerät ausgeschaltet\n" +

                "⏱️ Ladezeit: " +
                getState(
                    tablet.lastChargeTimeDP
                ).val

            );

        }

    }


    // ---------------------------------------------------------------
    // STATUS NEU PRÜFEN
    // ---------------------------------------------------------------

    setTimeout(function () {

        checkTablet(tablet);

    }, 500);

}


// ===================================================================
// MANUELL EIN BUTTON
// ===================================================================

function manualOn(tablet) {


    setState(
        tablet.modeDP,
        "Manuell EIN",
        false
    );


    // Button zurücksetzen

    setState(
        tablet.manualOnDP,
        false,
        true
    );


    checkTablet(tablet);

}


// ===================================================================
// MANUELL AUS BUTTON
// ===================================================================

function manualOff(tablet) {


    setState(
        tablet.modeDP,
        "Manuell AUS",
        false
    );


    // Button zurücksetzen

    setState(
        tablet.manualOffDP,
        false,
        true
    );


    checkTablet(tablet);

}


// ===================================================================
// LADEZYKLEN RESET
// ===================================================================

function resetCycles(tablet) {


    setState(
        tablet.chargeCyclesDP,
        0,
        true
    );


    setState(
        tablet.resetCyclesDP,
        false,
        true
    );


    sendNotification(

        "🔄 Ladezyklen zurückgesetzt\n\n" +

        "📱 " +
        tablet.displayName

    );


    log(
        "[" +
        tablet.displayName +
        "] Ladezyklen zurückgesetzt",
        "info"
    );

}


// ===================================================================
// DATENPUNKTE ERSTELLEN
// ===================================================================

createGlobalStates();


TABLETS.forEach(function (tablet) {

    createTabletStates(tablet);

});


// ===================================================================
// INITIALISIERUNG
// ===================================================================

setTimeout(function () {


    TABLETS.forEach(function (tablet) {


        // -----------------------------------------------------------
        // AKKUSTAND
        // -----------------------------------------------------------

        on(
            {
                id: tablet.batteryDP,
                change: "ne"
            },

            function () {

                checkTablet(tablet);

            }

        );


        // -----------------------------------------------------------
        // BETRIEBSART
        // -----------------------------------------------------------

        on(
            {
                id: tablet.modeDP,
                change: "ne"
            },

            function () {

                checkTablet(tablet);

            }

        );


        // -----------------------------------------------------------
        // MIN AKKU
        // -----------------------------------------------------------

        on(
            {
                id: tablet.minBatteryDP,
                change: "ne"
            },

            function () {

                checkTablet(tablet);

            }

        );


        // -----------------------------------------------------------
        // MAX AKKU
        // -----------------------------------------------------------

        on(
            {
                id: tablet.maxBatteryDP,
                change: "ne"
            },

            function () {

                checkTablet(tablet);

            }

        );


        // -----------------------------------------------------------
        // KRITISCHER AKKU
        // -----------------------------------------------------------

        on(
            {
                id: tablet.criticalBatteryDP,
                change: "ne"
            },

            function () {

                tablet.criticalNotified =
                    false;

                checkTablet(tablet);

            }

        );


        // -----------------------------------------------------------
        // SHELLY
        // -----------------------------------------------------------

        on(
            {
                id: tablet.shellyDP,
                change: "ne"
            },

            function (obj) {

                shellyChanged(
                    tablet,
                    obj
                );

            }

        );


        // -----------------------------------------------------------
        // MANUELL EIN
        // -----------------------------------------------------------

        on(
            {
                id: tablet.manualOnDP,
                val: true
            },

            function () {

                manualOn(tablet);

            }

        );


        // -----------------------------------------------------------
        // MANUELL AUS
        // -----------------------------------------------------------

        on(
            {
                id: tablet.manualOffDP,
                val: true
            },

            function () {

                manualOff(tablet);

            }

        );


        // -----------------------------------------------------------
        // LADEZYKLEN RESET
        // -----------------------------------------------------------

        on(
            {
                id: tablet.resetCyclesDP,
                val: true
            },

            function () {

                resetCycles(tablet);

            }

        );


        // -----------------------------------------------------------
        // STARTSTATUS
        // -----------------------------------------------------------

        const shellyState =
            getState(tablet.shellyDP);


        // Wenn beim Scriptstart geladen wird,
        // Ladebeginn anhand der Shelly-Zeit übernehmen.

        if (
            shellyState &&
            shellyState.val === true
        ) {

            tablet.chargeStartTime =
                shellyState.lc;

        }


        tablet.criticalNotified =
            false;


        // -----------------------------------------------------------
        // TABLET PRÜFEN
        // -----------------------------------------------------------

        checkTablet(tablet);


        log(
            "[" +
            tablet.displayName +
            "] gestartet",
            "info"
        );

    });


    log(
        "================================================",
        "info"
    );

    log(
        "Tablet Ladesteuerung V2 Deluxe gestartet",
        "info"
    );

    log(
        "Anzahl Tablets: " +
        TABLETS.length,
        "info"
    );

    log(
        "================================================",
        "info"
    );


}, 2000);


// ===================================================================
// LADEZEIT ALLE 30 SEKUNDEN AKTUALISIEREN
// ===================================================================

schedule(
    "*/30 * * * * *",
    function () {

        TABLETS.forEach(function (tablet) {

            updateChargeTime(tablet);

        });

    }
);
