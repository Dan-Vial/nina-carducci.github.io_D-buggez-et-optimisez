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

    execLink(allFontPreload, 'link[rel="preload"][as="font"]');
    execLink(allCssPreload, 'link[rel="preload"][as="style"]');

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

        await new Promise((resolve) => {
            document.head.lastElementChild.addEventListener('load', event => {
                resolve();
            });
        });
    }

    function execLink(arr, selector) {
        while (arr.length > 0) {
            arr[0].rel = 'stylesheet';
            delete arr[0].as;
            arr = document.querySelectorAll(selector);
        }
    }
}
