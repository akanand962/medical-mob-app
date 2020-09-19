import Pharmacy from '../models/Pharmacy'
import Prescription, {PrescriptionTypes, PrescriptionStatus} from '../models/Prescriptions'

export const PRESCRIPTIONS = [
    new Prescription(
        'id-11',
        'email',
        'pharmacyId',
        '01/01/2020',
        null,
        PrescriptionTypes.DELIVERY,
        '01/02/2020',
        null,
        null
    ),
]

export const PHARMACIES = [
    new Pharmacy(
        '36INdDkUhxSCVRWTwDao',
        "Kiran's Pharmacy",
        "1600 Amphitheatre Pkwy, Mountain View, California 94043",
        -122.08414,
        37.42307,
        true,
        []
    ),
    new Pharmacy(
        'id-2',
        "Ankit's Pharmacy",
        "803 Eleventh Ave, Sunnyvale, California 94089",
        -122.03157,
        37.40365,
        true,
        []
    ),
    new Pharmacy(
        'id-3',
        "Virender's Pharmacy",
        "345 Spear St, San Francisco, California 94105",
        -122.39028,
        37.78953,
        true,
        []
    ),
    new Pharmacy(
        'id-4',
        "Virender's Pharmacy",
        "345 Spear St, San Francisco, California 94105",
        -122.39028,
        37.78953,
        true,
        []
    ),
    new Pharmacy(
        'id-5',
        "Virender's Pharmacy",
        "345 Spear St, San Francisco, California 94105",
        -122.39028,
        37.78953,
        true,
        []
    ),
    new Pharmacy(
        'id-6',
        "Virender's Pharmacy",
        "345 Spear St, San Francisco, California 94105",
        -122.39028,
        37.78953,
        true,
        []
    ),
];

