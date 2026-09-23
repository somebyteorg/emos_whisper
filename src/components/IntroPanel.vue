<template>
    <section aria-labelledby="page-title" class="intro">
        <p class="eyebrow"><span class="eyebrow-dot"></span>给某个人的一点小心意</p>
        <h1 id="page-title">有些话，<br/><span>只想悄悄告诉一个人。</span></h1>
        <p class="intro-note">把没说出口的那一点，轻轻递给 TA。</p>
        <div aria-hidden="true" class="paper-sketch">
            <span class="paper-shadow"></span>
            <span class="paper-sheet"><i></i><i></i><i></i><b></b></span>
            <span class="paper-star">✳</span>
        </div>
    </section>
</template>

<style scoped>
.intro {
    position: relative;
    min-height: 570px;
    padding-top: 29px;
}

.eyebrow {
    margin: 0 0 24px;
    display: flex;
    align-items: center;
    gap: 9px;
    color: #788e83;
    font-size: 12px;
    font-weight: 650;
}

.eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e77b62;
    box-shadow: 0 0 0 4px #f8e8df;
}

h1 {
    max-width: 650px;
    margin: 0;
    color: #183d35;
    font-size: 58px;
    font-weight: 680;
    line-height: 1.34;
}

h1 span {
    position: relative;
    z-index: 0;
    white-space: nowrap;
}

h1 span::after {
    position: absolute;
    z-index: -1;
    right: -4px;
    bottom: 5px;
    left: -3px;
    height: 13px;
    transform: rotate(-1.5deg);
    border-radius: 2px;
    background: #f2d889;
    content: "";
}

.intro-note {
    margin: 22px 0 0;
    color: #74887f;
    font-size: 15px;
    line-height: 1.8;
}

.paper-sketch {
    position: absolute;
    left: 8px;
    bottom: 0;
    width: 166px;
    height: 131px;
    transform: rotate(-7deg);
}

.paper-shadow,
.paper-sheet {
    position: absolute;
    width: 118px;
    height: 91px;
    border-radius: 4px;
}

.paper-shadow {
    top: 20px;
    left: 25px;
    transform: rotate(11deg);
    background: #dcebe0;
}

.paper-sheet {
    top: 13px;
    left: 16px;
    padding: 25px 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 9px;
    background: #fffdf6;
    box-shadow: 0 8px 18px rgb(49 89 71 / 8%);
}

.paper-sheet i {
    width: 71%;
    height: 2px;
    border-radius: 3px;
    background: #b8cfc1;
}

.paper-sheet i:nth-child(2) {
    width: 86%;
}

.paper-sheet i:nth-child(3) {
    width: 55%;
}

.paper-sheet b {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 13px;
    height: 13px;
    border-radius: 2px;
    background: #ed9275;
}

.paper-star {
    position: absolute;
    right: 5px;
    bottom: 8px;
    color: #e2ae45;
    font-size: 20px;
}

@media (max-width: 1080px) {
    h1 {
        font-size: 48px;
    }

    h1 span {
        white-space: normal;
    }
}

@media (max-width: 820px) {
    .intro {
        min-height: 0;
        padding-top: 0;
    }

    h1 {
        font-size: 48px;
    }

    .paper-sketch {
        top: 0;
        right: 0;
        bottom: auto;
        left: auto;
        transform: scale(0.78) rotate(-7deg);
        transform-origin: top right;
    }
}

@media (max-width: 560px) {
    .eyebrow {
        margin-bottom: 19px;
        font-size: 11px;
    }

    h1 {
        max-width: 100%;
        font-size: 38px;
        line-height: 1.42;
    }

    h1 span {
        white-space: normal;
    }

    h1 span::after {
        bottom: 3px;
        height: 9px;
    }

    .intro-note {
        max-width: calc(100% - 75px);
        margin-top: 13px;
        font-size: 13px;
    }

    .paper-sketch {
        top: 124px;
        right: -4px;
        transform: scale(0.53) rotate(-7deg);
    }
}
</style>
