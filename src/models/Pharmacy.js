class Pharmacy {
    constructor(id, locationName, address, lng, lat, deliveryAvailable, prescriptions){
        this.id = id;
        this.locationName = locationName;
        this.address = address;
        this.lng = lng;
        this.lat = lat;
        this.deliveryAvailable = deliveryAvailable;
        this.prescriptions = prescriptions;
    }
}

export default Pharmacy