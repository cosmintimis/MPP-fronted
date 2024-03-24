export function displayAlert(container: HTMLElement, type: "success" | "error" | "warning", message: string) {
    const alertElement = document.createElement("div");
    alertElement.classList.add(
      "text-white",
      "px-4",
      "py-3",
      "rounded-lg",
      "shadow-md",
      "transition-all",
      "duration-300"
    );
  
    switch (type) {
      case "success":
        alertElement.classList.add("bg-green-500");
        break;
      case "error":
        alertElement.classList.add("bg-red-500");
        break;
      case "warning":
        alertElement.classList.add("bg-yellow-500");
        break;
    }
  
    alertElement.textContent = message;
  
    container.appendChild(alertElement);
  
    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  }