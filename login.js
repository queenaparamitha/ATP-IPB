import { auth } from "./admin/firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

window.login = function () {

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value;

    if (username !== "agribusinessandtechnologypark") {
        alert("Username salah!");
        return;
    }

    const email = "agribusinesstechnologypark@gmail.com";

    signInWithEmailAndPassword(auth, email, password)

        .then(() => {

            window.location.href = "../admin/dashboard.html";

        })

        .catch(() => {

            alert("Password salah!");

        });

}
