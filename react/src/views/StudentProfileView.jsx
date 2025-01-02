import ProfileView from "./ProfileView";

export default function StudentProfileView() {
    // Define the fields to display in the student's basic info
    const studentFields = [
        { label: "Gender", key: "gender", icon: "gender.png" },
        { label: "Birth Date", key: "birth_date", icon: "birthdate.png" },
        { label: "Age", key: "age", icon: "birthdate.png" },
        { label: "Nationality", key: "nationality", icon: "gender.png" },
        { label: "Address", key: "address", icon: "address.png" },
        { label: "Postal Code", key: "postal_code", icon: "address.png" },
        {
            label: "Registration Date",
            key: "registration_date",
            icon: "admissiondate.png",
        },
    ];

    return (
        <ProfileView
            profileType="student"
            fetchEndpoint="/students"
            profileFields={studentFields}
            title="Student"
        />
    );
}