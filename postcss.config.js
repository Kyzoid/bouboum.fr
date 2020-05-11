module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('@fullhuman/postcss-purgecss')({
            content: [
                './views/*.ejs',
                './public/javascripts/bouboum-ranking.js',
                './public/javascripts/add-ranking-data.js'
            ],
            defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
        })
    ]
}