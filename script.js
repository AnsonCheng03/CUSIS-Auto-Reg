(function () {
  // Create a gray div to overlay on top of the page for displaying logs
  let overlay = document.getElementById("log-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "35vh";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.maxHeight = "30vh";
    overlay.style.overflowY = "auto"; // Allow scrolling if the content exceeds max height
    overlay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    overlay.style.color = "#fff";
    overlay.style.fontSize = "16px";
    overlay.style.padding = "5px";
    overlay.style.zIndex = "1000";
    overlay.id = "log-overlay";
    document.body.appendChild(overlay);
  }

  // Function to display a message on the overlay
  function logMessage(message) {
    console.log(message);
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    overlay.appendChild(messageElement);

    // Remove older messages if more than 50 are present
    while (overlay.childNodes.length > 50) {
      overlay.removeChild(overlay.firstChild);
    }

    overlay.style.display = "block";

    // Ensure the overlay scrolls to show the latest message
    overlay.scrollTop = overlay.scrollHeight;
  }

  // Function to format the current time as HH:MM:SS
  function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(" ")[0]; // HH:MM:SS format
  }

  const targetUrl =
    "https://cusis.cuhk.edu.hk/psc/CSPRD_newwin/EMPLOYEE/SA/c/SSR_STUDENT_FL.SSR_SHOP_CART_FL.GBL?Page=SSR_SHOP_CART_FL";

  if (
    window.location.href.indexOf("SSR_STUDENT_FL.SSR_SHOP_CART_FL.GBL") ===
      -1 &&
    window.location.href.indexOf("SSR_SHOP_CART_FL") === -1
  ) {
    const userConfirm = window.confirm(
      "You are not on the CUHK Shopping Cart page. Do you want to be redirected?"
    );
    if (userConfirm) {
      window.location.href = targetUrl;
    } else {
      logMessage("User chose to stay on the current page.");
      return; // Exit the script to prevent it from running
    }
  } else {
    try {
      document.querySelector("#DERIVED_REGFRM1_DETAILS_LINK").click();
    } catch (e) {
      logMessage("Error while clicking the link: " + e.message);
    }

    const regtime = new Date(
      Date.parse(
        window.prompt(
          "請輸入reg科時間 (eg. 2023-08-10 10:00:00)",
          new Date(Date.now() + 2 * 60 * 1000 + 8 * 60 * 60 * 1000)
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "")
        )
      )
    );

    logMessage("準備開始");

    setTimeout(() => {
      document.querySelectorAll(".ps-checkbox").forEach((checkbox) => {
        if (!checkbox.checked) checkbox.click();
      });

      const interval = setInterval(() => {
        const currentTime = getCurrentTime();
        if (regtime > new Date()) {
          logMessage(`等緊夠鐘!!! ${currentTime}`);
        } else {
          setTimeout(() => {
            document.querySelector("#DERIVED_SSR_FL_SSR_ENROLL_FL").click();
          }, 100);
          logMessage("Reg緊！");
          clearInterval(interval);
        }
      }, 60);
    }, 2000); // Wait for 2 seconds before starting
  }
})();
