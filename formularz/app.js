$().ready(function () {
  // dodawanie myślnika do kodu pocztowego

  $("#postal").on("keydown", function (e) {
    var key = e.keyCode || e.charCode;
    if (key == 8 || key == 46) {
      if ($(this).val().length == 4) {
        $(this).val($(this).val().slice(0, -1));
      }
    } else {
      if ($(this).val().length == 2 && key != 189) {
        $(this).val($(this).val() + "-");
      }
    }
  });

  // pobieranie kodów

  let timeout = null;

  $("#postal").keyup(function () {
    clearTimeout(timeout);
    const query = $("#postal").val();

    timeout = setTimeout(() => {
      if ($("#postal").valid()) {
        $.getJSON(`http://kodpocztowy.intami.pl/api/${query}`, (data) => {
          $("#city").val(data[0].miejscowosc);
          data.map((item) => $("#street").append(`<option value=${item.ulica}>${item.ulica}</option>`));
        }).fail(() => alert("Podany kod nie istnieje."));
      }
    }, 1000);

    $("select").empty().append('<option value="">--Wybierz--</option>');
  });

  // walidacja

  $.validator.methods.email = function (value, element) {
    return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
  };

  $.validator.addMethod("postal", function (value, element) {
    return this.optional(element) || value.match(/^\d{2}-\d{3}$/);
  });

  $("form[name='registration']").validate({
    rules: {
      firstName: "required",
      lastName: "required",
      email: { required: true, email: true },
      phone: "required",
      postal: {
        required: true,
        postal: true,
      },
      city: "required",
      street: "required",
      houseNb: "required",
    },
    messages: {
      firstName: "Proszę podać imię.",
      lastName: "Proszę podać nazwisko.",
      email: { required: "Proszę podać adres email.", email: "Nieprawidłowy email." },
      phone: "Proszę podać numer telefonu.",
      postal: { required: "Proszę podać kod.", postal: "Nieprawidłowy kod.", remote: "Podany kod nie istnieje." },
      city: "Proszę podać miejscowość.",
      street: "Proszę wybrać ulicę.",
      houseNb: "Proszę podać numer.",
    },
    submitHandler: (form) => {
      const data = new FormData(form);
      const formJSON = Object.fromEntries(data.entries());
      alert(JSON.stringify(formJSON, null, 2));
    },
  });
});
