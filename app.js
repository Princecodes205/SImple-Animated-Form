const containers = document.querySelectorAll(".input-container");
const form = document.querySelector("form");
const checkbox = document.querySelector(".checkbox");
const tickMarkPart = document.querySelector(".tick-mark path");
const pathLength = tickMarkPart.getTotalLength();
const checkboxlabel = document.querySelector(".checkbox-label");
const button = document.querySelector("button");

const timeline = gsap.timeline({ defaults: { duration: 1 } });
const timeline2 = gsap.timeline({
  defaults: { duration: 0.5, ease: "Power2.easeOut" },
});
const timeline3 = gsap.timeline({
  defaults: { duration: 0.75, ease: "Power2.easeOut" },
});

// Line
const start =
  "M0 0.999512C0 0.999512 60.5 0.999512 150 0.999512C239.5 0.999512 300 0.999512 300 0.999512";
const end =
  "M1 0.999512C1 0.999512 61.5 7.5 151 7.5C240.5 7.5 301 0.999512 301 0.999512";

// Elastic Effect
containers.forEach((container) => {
  const input = container.querySelector(".input");
  const line = container.querySelector(".elastic-line");
  const placeholder = container.querySelector(".placeholder");

  input.addEventListener("focus", () => {
    if (!input.value) {
      timeline.fromTo(
        line,
        { attr: { d: start } },
        { attr: { d: end }, ease: "Power2.easeOut", duration: 0.75 }
      );
      timeline.to(
        line,
        { attr: { d: start }, ease: "elastic.out(3,0.5)" },
        "<50%"
      );
      timeline.to(
        placeholder,
        {
          top: -15,
          left: 0,
          scale: 0.7,
          ease: "Power2.easeOut",
          duration: 0.5,
        },
        "<"
      );
    } else {
      timeline.to(
        placeholder,
        {
          top: 20,
          left: 0,
          scale: 1,
          ease: "Power2.easeOut",
          duration: 0.5,
        },
        "<"
      );
    }
  });
});

form.addEventListener("click", () => {
  containers.forEach((container) => {
    const input = container.querySelector(".input");
    const line = container.querySelector(".elastic-line");
    const placeholder = container.querySelector(".placeholder");
    if (document.activeElement !== input) {
      if (!input.value) {
        gsap.to(placeholder, {
          top: 0,
          left: 0,
          scale: 1,
          duration: 0.5,
          ease: "Power2.easeOut",
        });
      }
    }
  });
});

const colorizee = function (color, line, placeholder) {
  gsap.to(line, { stroke: color, duration: 0.75 });
  gsap.to(placeholder, { color: color, duration: 0.75 });
};

const tickCheck = () => {
  gsap.set(tickMarkPart, {
    strokeDashoffset: pathLength,
    strokeDasharray: pathLength,
  });
  if (checkbox.checked) {
    timeline2.to(".checkbox-fill", { top: "0%" });
    timeline2.fromTo(
      tickMarkPart,
      { strokeDashoffset: pathLength },
      { strokeDashoffset: 0 }
    );
    timeline2.to(".checkbox-label", { color: "#6391e8" }, "<");
    return true;
  } else {
    timeline2.to(".checkbox-fill", { top: "100%" });
    timeline2.fromTo(
      tickMarkPart,
      { strokeDashoffset: 0 },
      { strokeDashoffset: pathLength }
    );
    timeline2.to(".checkbox-label", { color: "#fe8c99" }, "<");
    return false;
  }
};

checkbox.addEventListener("click", () => {
  if (tickCheck()) {
    console.log("checked");
    // return true;
  } else {
    console.log("not checked");
    // return false;
    return;
  }
});

const validateInput = function (input, line, placeholder) {
  if (input.type === "text") {
    let inputText = input.value;
    if (inputText.length > 2 && input.value.trim() !== "") {
      // Colorizee
      colorizee("#6391e8", line, placeholder);
      return true;
    } else {
      colorizee("#fe8c99", line, placeholder);
      return false;
    }
  }

  if (input.type === "email") {
    let validEmail = validateEmail(input.value);
    if (validEmail && input.value !== "") {
      // Colorizee
      colorizee("#6391e8", line, placeholder);
      return true;
    } else {
      colorizee("#fe8c99", line, placeholder);
      return false;
    }
  }

  if (input.type === "tel") {
    let validNumber = validatePhone(input.value);
    if (validNumber && input.value !== "") {
      // Colorizee
      colorizee("#6391e8", line, placeholder);
      return true;
    } else {
      colorizee("#fe8c99", line, placeholder);
      return false;
    }
  }
};

containers.forEach((container) => {
  const input = container.querySelector(".input");
  const line = container.querySelector(".elastic-line");
  const placeholder = container.querySelector(".placeholder");

  input.addEventListener("input", () => {
    validateInput(input, line, placeholder);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let isFormValid = true;

  containers.forEach((container) => {
    const input = container.querySelector(".input");
    const line = container.querySelector(".elastic-line");
    const placeholder = container.querySelector(".placeholder");

    if (!validateInput(input, line, placeholder)) {
      isFormValid = false;
    }
  });

  if (isFormValid) {
    console.log("The form is valid. Submitting...");

    if (tickCheck()) {
      console.log("has been tick");
    } else {
      console.log(" never tick am o");
      return;
    }

    timeline3.to(".contact-left, .contact-right", {
      y: 30,
      opacity: 0,
      pointerEvents: "none",
    });
    timeline3.to("form", { scale: 0.8 }, "<");
    timeline3.fromTo(".submitted", { opacity: 0, y: 30 }, { opacity: 1, y: 0 });

    // wave
    gsap.set("#hand", { transformOrigin: "left" });
    gsap.fromTo(
      "#hand",
      { rotation: 0, y: 0 },
      {
        rotation: -10,
        y: 2,
        ease: "elastic(3,0.3)",
        duration: 2,
        delay: 1,
        yoyo: true,
        repeat: -1,
      }
    );
  } else {
    console.log("The form is invalid. Please correct the errors.");
    // Add code to handle the case when the form is invalid
    return;
  }
});

// checking email validation

function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}
function validatePhone(phone) {
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(phone);
}

// Animating the chracter
gsap.set("#eye", { transformOrigin: "center" });
gsap.fromTo(
  "#eye",
  { scaleY: 1 },
  {
    scale: 0.5,
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.5,
    ease: "Power2.easeOut",
  }
);
gsap.fromTo(
  "#eyebrow",
  { y: 1 },
  {
    y: -1,
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.5,
    ease: "Power2.easeOut",
  }
);
