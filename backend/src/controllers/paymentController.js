const paymentService = require("../services/paymentService");

/* GET /api/payments/fees  — public fee table */
const getFees = (req, res) => {
    res.json({
        fees: {
            field:      Number(process.env.FEE_FIELD)      || 10000,
            volunteer:  Number(process.env.FEE_VOLUNTEER)  || 10000,
            internship: Number(process.env.FEE_INTERNSHIP) || 25000,
            attachment: Number(process.env.FEE_ATTACHMENT) || 25000,
        },
        currency: "TZS",
    });
};

/* POST /api/payments/initialize  — student initiates payment */
const initializePayment = async (req, res) => {
    try {
        const { applicationId } = req.body;
        if (!applicationId) return res.status(400).json({ message: "applicationId is required" });

        const data = await paymentService.initializePayment(req.user.id, Number(applicationId));
        res.status(201).json({ message: "Payment initialized", ...data });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* POST /api/payments/verify  — called by frontend after Flutterwave redirect */
const verifyPayment = async (req, res) => {
    try {
        const { tx_ref, transaction_id } = req.body;
        if (!tx_ref || !transaction_id) {
            return res.status(400).json({ message: "tx_ref and transaction_id are required" });
        }
        const result = await paymentService.verifyPayment(tx_ref, transaction_id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* GET /api/payments/my  — student's own payments */
const getMyPayments = async (req, res) => {
    try {
        const payments = await paymentService.getMyPayments(req.user.id);
        res.status(200).json({ payments });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* GET /api/payments/application/:applicationId  — payment status for one application */
const getPaymentByApplication = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentByApplication(
            req.user.id,
            Number(req.params.applicationId)
        );
        res.status(200).json({ payment });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/* GET /api/payments  — admin: all payments */
const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json({ payments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* POST /api/payments/webhook  — Flutterwave webhook (no auth) */
const webhook = async (req, res) => {
    try {
        const secret = req.headers["verif-hash"];
        if (secret !== process.env.FLW_SECRET_KEY) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { data } = req.body;
        if (data?.status === "successful") {
            await paymentService.verifyPayment(data.tx_ref, data.id);
        }
        res.status(200).json({ received: true });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getFees,
    initializePayment,
    verifyPayment,
    getMyPayments,
    getPaymentByApplication,
    getAllPayments,
    webhook,
};
