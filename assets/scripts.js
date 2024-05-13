window.addEventListener('load', async function () {
    await execAllPreload();

    $(document).ready(function () {
        $('.gallery').mauGallery({
            columns: {
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3
            },
            lightBox: true,
            lightboxId: 'myAwesomeLightbox',
            showTags: true,
            tagsPosition: 'top'
        });
    });
});

async function execAllPreload() {
    let range = document.createRange();
    let allFontPreload = document.querySelectorAll('link[rel="preload"][as="font"]');
    let allCssPreload = document.querySelectorAll('link[rel="preload"][as="style"]');
    let allScriptPreload = document.querySelectorAll('link[rel="preload"][as="script"]');

    while (allFontPreload.length > 0) {
        allFontPreload[0].rel = 'stylesheet';
        delete allFontPreload[0].as;
        allFontPreload = document.querySelectorAll('link[rel="preload"][as="font"]');
    }

    while (allCssPreload.length > 0) {
        allCssPreload[0].rel = 'stylesheet';
        delete allCssPreload[0].as;
        allCssPreload = document.querySelectorAll('link[rel="preload"][as="style"]');
    }

    while (allScriptPreload.length > 0) {
        let integrity = typeof allScriptPreload[0].integrity !== 'undefined' ? `integrity="${allScriptPreload[0].integrity}"` : '';
        let crossorigin = typeof allScriptPreload[0].crossorigin !== 'undefined' ? `crossorigin="${allScriptPreload[0].crossorigin}"` : '';

        // `<script src="${allScriptPreload[0].href}" ${integrity} ${crossorigin} defer></script>`;
        let script = range.createContextualFragment(`
            <script src="${allScriptPreload[0].href}" defer></script>
        `);
        document.head.appendChild(script);
        allScriptPreload[0].remove();

        allScriptPreload = document.querySelectorAll('link[rel="preload"][as="script"]');

        let started = true;
        var ended = true;
        while (ended) {
            if (started) {
                started = false;
                ended = await new Promise((resolve) => {
                    document.head.lastElementChild.addEventListener('load', event => {
                        resolve(false);
                    });
                });
            }
        }
    }
}
