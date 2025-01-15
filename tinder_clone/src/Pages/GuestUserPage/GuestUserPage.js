// import React, { useState } from 'react';

// export default function GuestUserPage() {
//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.username) newErrors.username = "Username is required.";
//         if (!formData.email) {
//             newErrors.email = "Email is required.";
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = "Enter a valid email.";
//         }
//         if (!formData.password) {
//             newErrors.password = "Password is required.";
//         } else if (formData.password.length < 6) {
//             newErrors.password = "Password must be at least 6 characters.";
//         }
//         if (formData.confirmPassword !== formData.password) {
//             newErrors.confirmPassword = "Passwords do not match.";
//         }
//         return newErrors;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = validateForm();
//         if (Object.keys(validationErrors).length === 0) {
//             alert("Registration Successful!");
//             setFormData({ username: "", email: "", password: "", confirmPassword: "" });
//         } else {
//             setErrors(validationErrors);
//         }
//     };


//     return (
//         <div style={styles.container}>
//             <form style={styles.form} onSubmit={handleSubmit}>
//                 <h2 style={styles.title}>Register</h2>
//                 <div style={styles.formGroup}>
//                     <label style={styles.label}>Username</label>
//                     <input
//                         style={styles.input}
//                         type="text"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                     />
//                     {errors.username && <p style={styles.error}>{errors.username}</p>}
//                 </div>

//                 <div style={styles.formGroup}>
//                     <label style={styles.label}>Email</label>
//                     <input
//                         style={styles.input}
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                     />
//                     {errors.email && <p style={styles.error}>{errors.email}</p>}
//                 </div>

//                 <div style={styles.formGroup}>
//                     <label style={styles.label}>Password</label>
//                     <input
//                         style={styles.input}
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                     />
//                     {errors.password && <p style={styles.error}>{errors.password}</p>}
//                 </div>

//                 <div style={styles.formGroup}>
//                     <label style={styles.label}>Confirm Password</label>
//                     <input
//                         style={styles.input}
//                         type="password"
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                     />
//                     {errors.confirmPassword && (
//                         <p style={styles.error}>{errors.confirmPassword}</p>
//                     )}
//                 </div>

//                 <button style={styles.button} type="submit">
//                     Register
//                 </button>
//             </form>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         background: "#f5f5f5",
//     },
//     form: {
//         width: "400px",
//         padding: "20px",
//         background: "#ffffff",
//         borderRadius: "8px",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//     },
//     title: {
//         textAlign: "center",
//         marginBottom: "20px",
//         color: "#333",
//     },
//     formGroup: {
//         marginBottom: "15px",
//     },
//     label: {
//         display: "block",
//         marginBottom: "5px",
//         fontSize: "14px",
//         color: "#555",
//     },
//     input: {
//         width: "100%",
//         padding: "10px",
//         border: "1px solid #ccc",
//         borderRadius: "4px",
//         fontSize: "14px",
//     },
//     button: {
//         width: "100%",
//         padding: "10px",
//         background: "#4CAF50",
//         color: "#fff",
//         border: "none",
//         borderRadius: "4px",
//         cursor: "pointer",
//         fontSize: "16px",
//     },
//     error: {
//         color: "red",
//         fontSize: "12px",
//         marginTop: "5px",
//     },
// };



import React, { useState } from "react";

const GuestRegisterForm = () => {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setNickname(e.target.value);
        setError(""); // Clear error while typing
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            setError("Nickname is required.");
            return;
        }

        alert(`Welcome, ${nickname}!`);
        setNickname(""); // Reset the form after submission
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h2 style={styles.title}>Guest Login</h2>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Nickname</label>
                    <input
                        style={styles.input}
                        type="text"
                        value={nickname}
                        onChange={handleChange}
                        placeholder="Enter your nickname"
                    />
                    {error && <p style={styles.error}>{error}</p>}
                </div>

                <button style={styles.button} type="submit">
                    Continue as Guest
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f9f9f9",
    },
    form: {
        width: "300px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        marginBottom: "20px",
        color: "#333",
    },
    formGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontSize: "14px",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "red",
        fontSize: "12px",
        marginTop: "5px",
    },
};

export default GuestRegisterForm;
