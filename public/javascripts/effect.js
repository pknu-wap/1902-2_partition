// ����,��ġ��
$(".btn").click(function (e) {
    e.preventDefault(); // href="#"�� ���ش�.
    $(".nav").slideToggle();

    // ��ư������ open Ŭ���� �������
    $(".btn").toggleClass("open");

    if ($(".btn").hasClass("open")) {
        // open�� ���� ��
        // attr�� �Ӽ� ���� �޼ҵ���.
        $(".btn").find("i").attr("class", "fa fa-angle-up");
    } else {
        // open�� ���� ��
        $(".btn").find("i").attr("class", "fa fa-angle-down");
    }
});

$(window).resize(function () {
    var wWidth = $(window).width();
    if (wWidth > 600) {
        $(".nav").removeAttr("style");
    }
});

// ����Ʈ �ڽ�
$(".lightbox").lightGallery({
    autoplay: true,
    pause: 3000,
    progressBar: true
});

//�̹��� �����̴�
$(".slider").slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                // arrows: true,
                // dots: false,
                autoplay: false
            }
        }
    ]
});