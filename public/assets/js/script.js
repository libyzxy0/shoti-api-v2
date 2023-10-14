function genShoti() {
  $.ajax({
    type: "POST",
    url: "/api/get-shoti",
    data: JSON.stringify({
      apikey: "shoti-1h9d3dcneqkb8vo4sog",
      refresh_error: true
    }),
    contentType: "application/json",
    success: function(response) {
      // console.log(JSON.stringify(response))
      let temp = `<video controls class="bg-secondary rounded pr-2" style="height: 16rem; width: 9rem;" loop><source src="${response.data.url}"></video>`;

      $("#vid-desc").text(`${response.user.nickname} ${response.user.username} | ${response.data.url}`)

      $("#video-play").html(temp)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error("Error:", textStatus, errorThrown);
    }
  });
}

document.getElementById('genshoti').addEventListener('click', genShoti);
window.addEventListener('load', genShoti);

$("#gen-key").click(function() {

  const captchaResponse = hcaptcha.getResponse();
  $.ajax({
    type: "POST",
    url: "/key-verify",
    data: JSON.stringify({ hcaptchaToken: captchaResponse }),
    contentType: "application/json",
    success: function(captcha) {
      if (!captcha.verified) return alert("Please verify captcha!");
      //alert(JSON.stringify(captcha));
      let username = $("#username").val();
      if (!username) return alert("Missing 'name' input.")
      $.ajax({
        type: "POST",
        url: "/api/new-key",
        data: JSON.stringify({
          username
        }),
        contentType: "application/json",
        success: function(response) {
          hcaptcha.reset();
          $("#copy").click(function() {
            navigator.clipboard.writeText(response.data.apikey)
              .then(() => {
                $("#copy").text('Copied!');
                setTimeout(() => {
                  $("#copy").text('Copy Apikey');
                }, 2000)
              })
          })
          $("#modal").modal("show");
          $("#modal-info").html(`
              <p><b>Name: </b>${username}</p>
              <p><b>Apikey: </b>${response.data.apikey}</p>
          `)
        },
        error: function(jqXHR, textStatus, errorThrown) {
          hcaptcha.reset();
          console.error("Error:", textStatus, errorThrown);
        }
      })
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Captcha Error:");
    }
  })
}) 