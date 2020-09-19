export const PrescriptionStatus = {
    ORDER_PLACED: 'order-placed',
    ORDER_RECEIVED: 'order-received',
    MORE_INFO_NEEDED: 'more-info-needed',
    IN_PROCESS: 'in-process',
    ORDER_READY: 'order-ready',
    PICKED_UP: 'picked-up',
    DELIVERED: 'delivered',
    RESCHEDULED: 'rescheduled',
    CANCELLED: 'cancelled',
}

export const PrescriptionTypes = {
    DELIVERY: 'delivery',
    PICKUP: 'pickup'
}

class Prescription {
    constructor(id, email, pharmacyId, orderDate, status, type, dueDate, finishDate, extractedText, patientComments, pharmacyComments, imageCloudUrl, refNo){
        this.id = id,
        this.email = email,
        this.pharmacyId = pharmacyId,
        this.orderDate = orderDate,
        this.status = status,
        this.type = type,
        this.dueDate = dueDate,
        this.finishDate = finishDate,
        this.extractedText = extractedText,
        this.patientComments = patientComments,
        this.pharmacyComments = pharmacyComments,
        this.imageCloudUrl = imageCloudUrl,
        this.refNo = refNo
    }
}

export default Prescription