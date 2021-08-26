window.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.getElementsByClassName('section')); // All the sections of the homepage's slider
    const container = document.getElementById('container'); // The sections' container

    // Object with properties related to the fullscreen touch slider controler.
    const touchParams = {
        sections: sections, // Sections of the fullscreen touch slider.
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

    // Handle scrolleable sections --------------------------------------
    const scrolleables = container.querySelectorAll('[scrolleable]');

    scrolleables.forEach((scrolleable) => {
        scrolleable.addEventListener('scroll', function () {
            checkScrollInScrolleable(this, container, touchParams);
        });
    });

    // Go to second section with the button
    const nextSectionBtn = document.querySelector('#nextSectionBtn');
    nextSectionBtn.addEventListener('click', () => {
        touchParams.index = 1;
        adjustByIndex(container, touchParams);
        touchParams.index = 1;
    });
});

/**
 * This function makes sure that the scroll of a scrolleable section is at some bound to be able to slide to other section.
 * @param {*} scrolleable the scrolleable section DOM element.
 * @param {*} container the sectoins' container.
 * @param {*} touchParams the Oject with properties related to the fullscreen touch slider controler.
 */
function checkScrollInScrolleable(scrolleable, container, touchParams) {
    touchParams.canSlideUp = false;
    touchParams.canSlideDown = false;

    if (
        scrolleable.scrollTop + scrolleable.getBoundingClientRect().bottom >=
        scrolleable.scrollHeight - 10
    ) {
        touchParams.canSlideDown = true;
    }
    if (scrolleable.scrollTop <= 10) {
        touchParams.canSlideUp = true;
    }
}

/**
 * Adjusts the height of the sections, html and body DOM elements to fill the full viewport
 * @param {*} sections
 */
function adjustHeight(sections) {
    let vh = window.innerHeight;
    document.querySelector('html').style.height = `${vh}px`;
    document.querySelector('body').style.height = `${vh}px`;

    sections.forEach((section) => {
        section.style.height = `${vh}px`;
    });
}

/**
 * Make the header's animation when the page has been loaded
 */
function anim() {
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    const socialIcons = document.querySelectorAll('.socialIcon');
    const footprint = document.querySelector('#footprint');

    // Title fade in
    headerTitle.animate([{ opacity: '1' }], {
        easing: 'ease',
        duration: 2000,
        fill: 'forwards',
    });

    // Subtitle fade in
    headerSubtitle.animate([{ opacity: '1' }], {
        delay: 1500,
        duration: 2000,
        fill: 'forwards',
    });

    // Footprint loop rotation
    footprint.animate(
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

    // Social media icons fade in
    for (let i = 0; i < socialIcons.length; ++i) {
        socialIcons[i].animate([{ transform: 'scale(1)' }], {
            easing: 'ease',
            delay: 350 * i,
            duration: 500,
            fill: 'forwards',
        });
    }
}

/**
 * Adds event handlers to all touch events
 */
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
