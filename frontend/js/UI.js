window.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.getElementsByClassName('section')); // All the sections of the homepage's slider
    const container = document.getElementById('container'); // The sections' container

    // Object with properties related to the fullscreen touch slider controler.
    const touchParams = {
        sections: sections, // Sections of the fullscreen touch slider.
        isDragging: false, // It'll be true while dragging the slider.
        startPosition: 0, // Y-Axis position where the dragging began.
        previousPosition: 0, // Y-Axis position prior to the start of dragging.
        currentPosition: 0, // Current Y-Axis position, updated while dragging.
        relativeToStart: 0, // Difference in position from where dragging started.
        index: 0, // The current section showed on the viewport.
        canSlideUp: true, // True if I can slide into a next section.
        canSlideDown: true, // True if I can slide into a previous section.
    };

    adjustHeight(sections);
    anim();
    touchEvents(container, touchParams);

    window.addEventListener('resize', () => {
        adjustHeight(sections);
        adjustByIndex(container, touchParams);
    });

    // Handle scrolleable sections
    const scrolleables = container.querySelectorAll('[scrolleable]');

    scrolleables.forEach((scrolleable) => {
        scrolleable.addEventListener('scroll', function () {
            handleScrolleableSection(this, container, touchParams);
        });
    });

    const nextSectionBtn = document.querySelector('#nextSectionBtn');
    nextSectionBtn.addEventListener('click', () => {
        touchParams.index = 1;
        adjustByIndex(container, touchParams);
        touchParams.index = 1;
    });
});

function handleScrolleableSection(scrolleable, container, touchParams) {
    touchParams.canSlideUp = false;
    touchParams.canSlideDown = false;

    if (
        scrolleable.scrollTop + scrolleable.getBoundingClientRect().bottom >=
        scrolleable.scrollHeight - 10
    ) {
        console.log('Down');
        touchParams.canSlideDown = true;
    }
    if (scrolleable.scrollTop <= 10) {
        console.log('TOP');

        touchParams.canSlideUp = true;
    }
}

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
            duration: 1000,
            fill: 'none',
            iterations: Infinity,
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
    };
}

function touchMoveHandler(container, touchParams) {
    return (e) => {
        touchParams.relativeToStart =
            e.touches[0].clientY - touchParams.startPosition;

        if (Math.abs(touchParams.relativeToStart) < 150) {
            touchParams.currentPosition =
                touchParams.relativeToStart + touchParams.previousPosition;
        }

        if (touchParams.canSlideUp && touchParams.relativeToStart > 10) {
            container.style.transform = `translateY(${touchParams.currentPosition}px)`;
        } else if (
            touchParams.canSlideDown &&
            touchParams.relativeToStart < -10
        ) {
            container.style.transform = `translateY(${touchParams.currentPosition}px)`;
        }
    };
}

function touchEndHanlder(container, touchParams) {
    return (e) => {
        if (
            touchParams.relativeToStart > 100 &&
            touchParams.index > 0 &&
            touchParams.canSlideUp
        ) {
            touchParams.index--;
            touchParams.canSlideDown = true;
            touchParams.canSlideUp = true;
        } else if (
            touchParams.relativeToStart < -100 &&
            touchParams.index < touchParams.sections.length - 1 &&
            touchParams.canSlideDown
        ) {
            touchParams.index++;
            touchParams.canSlideDown = true;
            touchParams.canSlideUp = true;
        }
        adjustByIndex(container, touchParams);
    };
}

/**
 * Adjusts the position of the container depending on the index of the current section.
 * @param {*} container The section's container
 * @param {*} touchParams An object whose properties are variables related to the touch handler
 */
function adjustByIndex(container, touchParams) {
    container.style.transform = `translateY(${
        window.innerHeight * -touchParams.index
    }px)`;
    touchParams.relativeToStart = 0;
    touchParams.previousPosition = -touchParams.index * window.innerHeight;
}
