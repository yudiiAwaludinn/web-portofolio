// ---------- Filter portofolio ----------
      const filterButtons = document.querySelectorAll(".filters button");
      const workItems = document.querySelectorAll(".work-item");

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter;
          filterButtons.forEach((b) =>
            b.setAttribute("aria-pressed", b === button),
          );
          let n = 0;
          workItems.forEach((item) => {
            item.hidden = filter !== "all" && item.dataset.category !== filter;
            if (item.hidden) return;
            // putar ulang animasi
            item.classList.remove("in");
            item.style.setProperty("--d", n++ * 80 + "ms");
            void item.offsetWidth;
            item.classList.add("in");
          });
        });
      });

      // ---------- Form kontak ----------
      const FORM_ENDPOINT = "https://formspree.io/f/mljgawoo";
      const MY_EMAIL = "yudiawaludin@gmail.com";
      const form = document.getElementById("contactForm");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const hasEmpty = ["name", "email", "type", "message"].some(
          (k) => !(data[k] || "").trim(),
        );
        if (hasEmpty) return alert("Harap isi semua kolom");
        if (!form.elements.email.checkValidity())
          return alert("Format email tidak valid");

        if (!FORM_ENDPOINT) {
          alert(
            "Pesan anda sudah dikirim. Mohon di tunggu",
          );
          const subject = encodeURIComponent(
            "Permintaan " + data.type + " dari " + data.name,
          );
          const body = encodeURIComponent(
            data.message + "\n\n" + data.name + " (" + data.email + ")",
          );
          window.location.href =
            "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
          return;
        }

        const button = form.querySelector("button[type=submit]");
        button.disabled = true;
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error("Request failed");
          alert("Pesannya sudah dikirim");
          form.reset();
        } catch (err) {
          alert("Pesan gagal dikirim. Silakan coba lagi.");
        } finally {
          button.disabled = false;
        }
      });

      // --- Animasi muncul saat scroll ---
      if (
        "IntersectionObserver" in window &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const targets = new Set(
          document.querySelectorAll(
            [
              ".hero .col-lg-7 > *",
              ".hero .portrait-wrap",
              ".section-head",
              "#about .about-photo",
              "#about .col-lg-7 > :not(.section-head)",
              "#services .row > div",
              ".filters",
              ".work-item",
              "#skills .row > div",
              ".contact .col-lg-5 > *",
              ".form-card",
              ".site-footer .row > div",
              ".footer-bottom",
            ].join(","),
          ),
        );

        document.documentElement.classList.add("reveal-ready");

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio >= 0.12)
                entry.target.classList.add("in");
              else if (entry.intersectionRatio === 0)
                entry.target.classList.remove("in");
            });
          },
          { threshold: [0, 0.12] },
        );

        targets.forEach((el) => {
          el.classList.add("reveal");
          const index = Array.prototype.indexOf.call(
            el.parentElement.children,
            el,
          );
          el.style.setProperty("--d", Math.min(index, 5) * 90 + "ms");
        });

        // elemen yang sudah terlihat (hero) tetap beranimasi
        void document.body.offsetHeight;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => targets.forEach((el) => io.observe(el))),
        );
      }

      document.getElementById("year").textContent = new Date().getFullYear();