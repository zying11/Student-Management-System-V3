import ProfileView from "./ProfileView";

export default function AdminProfileView() {
    // Define the fields to display in the admin's basic info
    const adminFields = [
        { label: "Email", key: "email", icon: "email.png" },
        { label: "Phone Number", key: "phone_number", icon: "phone.png" },
        { label: "Gender", key: "gender", icon: "gender.png" },
        { label: "Birth Date", key: "birth_date", icon: "birthdate.png" },
        { label: "Age", key: "age", icon: "birthdate.png" },
        { label: "Nationality", key: "nationality", icon: "gender.png" },
        { label: "Address", key: "address", icon: "address.png" },
        { label: "Postal Code", key: "postal_code", icon: "address.png" },
        {
            label: "Admission Date",
            key: "joining_date",
            icon: "admissiondate.png",
        },
    ];

    return (
        <ProfileView
            profileType="admin"
            fetchEndpoint="/admins"
            profileFields={adminFields}
            title="Admin"
        />
    );
}
