const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create()
const replace = require('gulp-replace')
const fileinclude = require('gulp-file-include')
const ttf2woff2 = require('gulp-ttf2woff2')
const fonter = require('gulp-fonter')
const fs = require('fs')
const webp = require('gulp-webp')
const webphtml = require('gulp-webp-html-nosvg')
const webpcss = require("gulp-webpcss")
const webpconverter = require('webp-converter')
const svgSprite = require('gulp-svg-sprite')
const cheerio = require('gulp-cheerio')
const imgRetina = require('gulp-img-retina');

const path = {
    css: {
        src: `./src/css/**/*.css`,
        dest: `./dist/css/`
    },
    scss: {
        src: `./src/scss/style.scss`,
        dest: `./dist/css/`
    },
    scripts: {
        src: `./src/js/**/*.js`,
        dest: `./dist/js/`
    },
    images: {
        src: `./src/images/**/*`,
        dest: `./dist/images/`
    },
    html: {
        src: `./src/*.html`,
        dest: `./dist/`
    }
}

function html() {
    return gulp.src(path.html.src)
      .pipe(fileinclude())
      .pipe(replace(/@img\//g, './images/'))
      .pipe(replace(/@js\//g, './js/'))
      .pipe(replace(/@css\//g, './css/'))
      .pipe(webphtml())
	  .pipe(imgRetina())
      .pipe(gulp.dest(path.html.dest))
      .pipe(browserSync.stream())
}

function scss() {
    return gulp.src('./src/scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(replace(/@img\//g, '../images/'))
      .pipe(sass().on('error', sass.logError))
    //   .pipe(webpcss(
    //     {
    //         webpClass: '.webp',
    //         noWebpClass: '.no-webp'
    //     }
    //   ))
      .pipe(autoprefixer({
        grid: true,
        overrideBrowserslist: ['last 3 version'],
        cascade: true
      }))
      .pipe(gulp.dest(path.css.dest))
      .pipe(cleanCSS({
          level: 2
      }))
      .pipe(rename({
          basename: 'style',
          suffix: '.min'
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.css.dest))
      .pipe(browserSync.stream())
}

function css() {
    return gulp.src('./src/css/**/*.css')
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(gulp.dest(path.css.dest))
    .pipe(browserSync.stream())
}

function svg() {
    return gulp.src('./src/images/icons/*.svg')
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
      .pipe(svgSprite({
        mode: {
            stack: {
                sprite: `../icons/icons.svg`,
                // html файл с превью всех иконок
                example: false,
            }
        }
    }))
      .pipe(gulp.dest('./assets/images/'))
      .pipe(browserSync.stream())
}

function scripts() {
    return gulp.src('./src/js/**/*.js', {
        sourcemaps: true
    })
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(uglify())
    .pipe(rename({
        basename: 'script',
        suffix: '.min'
    }))
    .pipe(gulp.dest(path.scripts.dest))
    .pipe(browserSync.stream())
}

function images() {
    return gulp.src(path.images.src)
        .pipe(newer(path.images.dest))
		.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3,
        }))
		.pipe(gulp.dest(path.images.dest))
        .pipe(webp())
		.pipe(gulp.dest(path.images.dest))
        .pipe(browserSync.stream())
}

function clean() {
    return del(['assets/*', '!assets/images', '!assets/fonts'])
    // return del(['dist/*'])
}

function ttfToWoff() {
    return gulp.src(`./src/fonts/*.ttf`, {})
    .pipe(newer(`./assets/fonts/`))
    .pipe(fonter({
        formats: ['woff']
    }))
    .pipe(gulp.dest(`./assets/fonts/`))
    .pipe(gulp.src(`./src/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(`./assets/fonts/`))
}

function fontsStyle() {
    // файл стилей для подключения шрифтов
    let fontsFile = `./src/scss/fonts.scss`

    // проверяем, существует ли файлы шрифтов
    fs.readdir('./assets/fonts/', function (err, fontsFiles){
        if(fontsFiles) {
            // проверяем, существует ли файл стилей для подключения шрифтов
            if(!fs.existsSync(fontsFile)) {
                // если файла нет - создаем его
                fs.writeFile(fontsFile, '', cb)
                let newFileOnly

                for(var i = 0; i < fontsFiles.length; i++) {
                    let fontFileName = fontsFiles[i].split('.')[0]

                    if(newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName

                        if(fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100
                        } else if(fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200
                        } else if(fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300
                        } else if(fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500
                        } else if(fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600
                        } else if(fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700
                        } else if(fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                            fontWeight = 800
                        } else if(fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900
                        } else {
                            fontWeight = 400
                        }

                        fs.appendFile(fontsFile,
`@font-face{
    font-family: ${fontName};
    font-display: swap;
    src: url("../fonts/${fontFileName}.woff2") format("woff2"),
            url("../fonts/${fontFileName}.woff") format("woff");
    font-weight: ${fontWeight};
    font-style: normal;
}\r\n`, cb)
                        newFileOnly = fontFileName
                    }
                }
            } else {
                // если файл существует
                console.log('Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить');
            }
        }
    })

    return gulp.src(`./src`)

    function cb() { }

}



function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
		// proxy: "gaming-guide.loc",
		// host: "gaming-guide.loc",
		// open: "external",
		// files: ['./**/*.php'],
    })

    gulp.watch(path.scss.src, scss).on('change', browserSync.reload)
    gulp.watch(path.css.src, css).on('change', browserSync.reload)
    gulp.watch(path.scripts.src, scripts).on('change', browserSync.reload)
    gulp.watch(path.images.src, images).on('change', browserSync.reload)
    gulp.watch(path.html.src, html).on('change', browserSync.reload)
    gulp.watch(`./src/**/*.html`, html).on('change', browserSync.reload)
    gulp.watch(`./src/scss/**/*.scss`, scss).on('change', browserSync.reload)
}

const build = gulp.series(clean, gulp.parallel(html, scripts, scss, css, images, svg), watch)

exports.clean = clean
exports.scripts = scripts
exports.scss = scss
exports.watch = watch
/* Добавляем шрифты один раз в начале проекта. Написать gulp fonts */
exports.fonts = gulp.series(ttfToWoff, fontsStyle)
exports.default = build