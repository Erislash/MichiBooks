window.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.getElementsByClassName('section'));
    const container = document.getElementById('container');
    const touchParams = {
        sections: sections,
        isDragging: false,
        startPosition: 0,
        previousPosition: 0,
        currentPosition: 0,
        relativeToStart: 0,
        index: 0,
        endPosition: 0,
        canSlide: true,
    };

    adjustHeight(sections);
    anim();
    touchEvents(container, touchParams);

    const postsOverview = container.querySelector('[scrolleable]');
    postsOverview.addEventListener('scroll', () => {
        if (touchParams.index !== 2) {
            touchParams.canSlide = false;
            return;
        }
        touchParams.canSlide = false;
        if (
            postsOverview.scrollTop +
                postsOverview.getBoundingClientRect().bottom >=
                postsOverview.scrollHeight - 10 ||
            postsOverview.scrollTop <= 10
        ) {
            touchParams.canSlide = true;
        }
        console.log(
            postsOverview.scrollTop,
            'awdad',
            postsOverview.scrollHeight,
            'adwa',
            postsOverview.getBoundingClientRect()
        );
    });
});

function adjustHeight(sections) {
    let vh = window.innerHeight;
    document.querySelector('html').style.height = `${vh}px`;
    document.querySelector('body').style.height = `${vh}px`;

    sections.forEach((section) => {
        section.style.height = `${vh}px`;
    });
}

function anim() {
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    const socialIcons = document.querySelectorAll('.socialIcon');
    const step = document.querySelector('#step');

    headerTitle.animate([{ opacity: '1' }], {
        easing: 'ease',
        duration: 2000,
        fill: 'forwards',
    });

    headerSubtitle.animate([{ opacity: '1' }], {
        delay: 1500,
        duration: 2000,
        fill: 'forwards',
    });

    step.animate(
        [
            { transform: 'rotate(380deg)' },
            { transform: 'rotate(300deg)' },
            { transform: 'rotate(400deg)' },
            { transform: 'rotate(380deg)' },
        ],
        {
            duration: 500,
            fill: 'forwards',
        }
    );

    for (let i = 0; i < socialIcons.length; ++i) {
        socialIcons[i].animate([{ transform: 'scale(1)' }], {
            easing: 'ease',
            delay: 350 * i,
            duration: 500,
            fill: 'forwards',
        });
    }
}

function touchEvents(container, touchParams) {
    container.addEventListener(
        'touchstart',
        touchStartHanlder(container, touchParams)
    );
    container.addEventListener(
        'touchmove',
        touchMoveHandler(container, touchParams)
    );
    container.addEventListener(
        'touchend',
        touchEndHanlder(container, touchParams)
    );
    container.addEventListener(
        'touchcancel',
        touchEndHanlder(container, touchParams)
    );
}

function touchStartHanlder(container, touchParams) {
    return (e) => {
        touchParams.isDragging = true;
        touchParams.startPosition = e.touches[0].clientY;
        // console.log('Start:', touchParams.startPosition);
    };
}

function touchMoveHandler(container, touchParams) {
    return (e) => {
        if (!touchParams.canSlide && touchParams.index === 2) return;

        touchParams.relativeToStart =
            e.touches[0].clientY - touchParams.startPosition;

        if (Math.abs(touchParams.relativeToStart) < 150) {
            touchParams.currentPosition =
                touchParams.relativeToStart + touchParams.previousPosition;
        }
        container.style.transform = `translateY(${touchParams.currentPosition}px)`;
    };
}

function touchEndHanlder(container, touchParams) {
    return (e) => {
        touchParams.previousPosition = touchParams.currentPosition;

        // if (touchParams.index === 2) {
        //     return;
        // }

        if (touchParams.relativeToStart > 100 && touchParams.index > 0) {
            touchParams.index--;
        } else if (
            touchParams.relativeToStart < -100 &&
            touchParams.index < touchParams.sections.length - 1
        ) {
            touchParams.index++;
        }
        // console.log(touchParams.index);
        adjustByIndex(container, touchParams);
    };
}

function adjustByIndex(container, touchParams) {
    container.style.transform = `translateY(${
        window.innerHeight * -touchParams.index
    }px)`;
    touchParams.previousPosition = -touchParams.index * window.innerHeight;
    console.log(touchParams.index);
}
