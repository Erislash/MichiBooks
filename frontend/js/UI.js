window.addEventListener('DOMContentLoaded', () => {
    adjustHeight();
    anim();
});

/**
 * This function makes the vertical height resize so that the  screen fit and look good on mobile devices
 */
function adjustHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

function anim() {
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    const socialIcons = document.querySelectorAll('.socialIcon');
    const step = document.querySelector('#step');

    headerTitle.animate([{ left: '0%' }], {
        duration: 300,
        fill: 'forwards',
    });

    headerSubtitle.animate([{ opacity: '1' }], {
        duration: 500,
        fill: 'forwards',
    });

    step.animate([{ transform: 'rotate(720deg)' }], {
        duration: 700,
        fill: 'forwards',
    });

    for (let i = 0; i < socialIcons.length; ++i) {
        socialIcons[i].animate([{ transform: 'scale(1)' }], {
            delay: 350 * i,
            duration: 500,
            fill: 'forwards',
        });
    }
}
