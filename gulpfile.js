'use strict';

const gulp = require('gulp'),
    rimraf = require('rimraf'),
    svgSprite = require('gulp-svg-sprite'),
    plumberNotifier = require('gulp-plumber-notifier'),
	del = require('del'),//удаление файлов
    mainfiles = require('main-bower-files'),//переопределение основных файлов Bower
    pug = require('gulp-pug'),//плагин компиляции pug
    sass = require('gulp-sass'),//плагин компиляции scss
	cleanCSS = require('gulp-clean-css'), //плагин минификации css
    prefixer = require('gulp-autoprefixer'),//плагин расстановки префиксов
    concat = require('gulp-concat'),//плагин конкатенации
    uglify = require('gulp-uglify'),//плагин сжатия js
    sourcemaps = require('gulp-sourcemaps'),//плагин создания map-файлов
    rigger = require('gulp-rigger'),
    browserSync = require("browser-sync"),
	plumber = require("gulp-plumber"),
	//size = require('gulp-size'),
    reload = browserSync.reload,
	gulpIf=require ('gulp-if'),
    sftp = require('gulp-sftp'),//работа с SFTP
    git = require('gulp-git'),//работа с git
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
	fileinclude = require('gulp-file-include'),
	//bourbon = require('node-bourbon'),
    //утилиты
    rename = require('gulp-rename'),
    newer =require('gulp-newer'),
    filter = require('gulp-filter'),
    //отладка
    debug = require('gulp-debug'),
    notify = require('gulp-notify'),
    //watch = require('gulp-watch'),
    //argv = require('yargs').argv,
    fs = require('fs');// работа с файловой системой

const isDevelopment = !process.env.NODE_ENV||process.env.NODE_ENV =='development';

/* Настройка переменных для проекта */

var pathProj = {
        build: { // пути для сборки проектов
            html:'build/',
            pug: 'build/html/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/img/',
            fonts: 'build/css/fonts/',
            svg: 'build/svg/'
        },
        src: { // пути размещения исходных файлов проекта
            pug: 'src/pug/*.{pug,jade}',
            js: 'src/js/**/*.js',
        	jslibs: 'src/js/libs/*.js',
            style: 'src/style/**/style.scss',
            img: 'src/img/**/*.*',
            fonts: 'src/fonts/**/*.*',
			html: 'src/html/**/*.html',
            svg: 'src/svg/*.svg',
            svgsprt: 'src/svg/*/*.svg'
        },
        watch: { // пути файлов, за изменением которых мы хотим наблюдать
            pug: 'src/**/*.pug',
            html:'src/html/**/*.html',
            js: 'src/js/**/*.js',
        	jslibs: 'src/js/libs/*.js',
            style: 'src/style/**/*.scss',
            img: 'src/img/**/*.*',
            svg: 'src/svg/**/.svg'
        },
        filter:{ // выражения для фильтрации файлов
                fonts:'**/*.{ttf,otf,woff,woff2,eot,svg}'
        },
        clean: './build/**',  // путь очистки директории для сборки 
},

site = {
        server:"",
        user:"",
        pass:"",
        port:"",
        folder:""
},

	//check it in net

	config = {
    	server: {
        	baseDir: "./build/"
    	},
    	tunnel: false,
    	host: 'localhost',
    	port: 9000
};

// Настройка BrowserSync
gulp.task('webserver', function () {
    browserSync(config);
});


//сборка svg спрайта
gulp.task('svg-sprite', function() {
    return gulp.src(pathProj.src.svg)
        .pipe(svgSprite({
            mode: {
                symbol: {
                    prefix: '.b-icon__',
                    dest: '',
                    dimensions: '',
                    sprite: 'sprite.svg',
                    example: false
                }
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                rootAttributes: {
                    class: 'b-icons__svg'
                },
                namespaceClassnames: false
            }
        }))
        .pipe(gulp.dest(('src/svg-sprite/')));
});

/* Задачи для компиляции и перемещения файлов */


//очистка папки сборки
gulp.task('clean', function(done){
   rimraf(pathProj.clean, done);
});


gulp.task('mv:fonts',function(done){
    gulp.src(pathProj.src.fonts)
        .pipe(gulp.dest(pathProj.build.fonts));
    done();
});

gulp.task('mv:html',function(done){
    gulp.src('./src/*.html')
        .pipe(gulp.dest(pathProj.build.all));
    done();
});

gulp.task('mv:js',function(done){
    gulp.src('./src/js/*.js')
        .pipe(gulp.dest(pathProj.build.js));
    done();
});

//  компиляция html
gulp.task('build:pug',function(done){
    gulp.src(pathProj.src.pug)
        .pipe(pug({
            pretty:true
        }))
        .pipe(gulp.dest(pathProj.build.pug));
    done();
});

// Сборка HTML
gulp.task('build:html', function(done) {
  gulp.src(pathProj.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(pathProj.build.html));
	done();
});

// Копирование шрифтов
gulp.task('build:fonts', function() {
    gulp.src(pathProj.src.fonts)
        .pipe(gulp.dest(pathProj.build.fonts))
});

//Компиляция CSS
gulp.task('build:scss',function(done){
    gulp.src(pathProj.src.style)
	  	/*.pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))*/
        .pipe(plumberNotifier())
        .pipe(/*gulpIf(isDevelopment,*/sourcemaps.init())
		.pipe(debug({title: 'src'}))
        .pipe(sass({
            //includePaths: require('node-bourbon').includePaths,
			outputStyle:"compressed",
            sourcemaps:true
        }))
		.pipe(debug({title: 'sass'}))
	   	.pipe(sass.sync().on('error', sass.logError))
        .pipe(prefixer({
            cascade:false,
            browsers: ['last 5 versions'],
            remove:true
        }))  //выставляем вендерные префиксы
        .pipe(/*gulpIf(isDevelopment,*/sourcemaps.write('./'))
        .pipe(gulp.dest(pathProj.build.css))
	 	.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(debug({title: 'min_src'}))
	 	.pipe(gulp.dest(pathProj.build.css))
        .pipe(reload({stream: true})); //И перезагрузим сервер
    done();
});


//js
/*gulp.task('build:js', function (done) {
    gulp.src(pathProj.src.js) //main файл
        .pipe(rigger()) // rigger- склеиваем
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //сжатие js
        .pipe(sourcemaps.write('.')) //Пропишем карты
        .pipe(gulp.dest(pathProj.build.js)) // готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
    done();
});*/

//Сборка и оптимизация JS libs

gulp.task('js', function (done) {
    gulp.src(pathProj.src.js)
        .pipe(plumberNotifier())
        .pipe(gulp.dest(pathProj.build.js))
        .pipe(reload({stream: true}));
    done();
});

//Сборка JS
gulp.task('jslibs', function () {
    return gulp.src(pathProj.src.jslibs)
        .pipe(plumberNotifier())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(pathProj.build.js))
        .pipe(reload({stream: true}));
});


//Сжатие картинок (для продакшен)

gulp.task('build:img', function (done) {
    gulp.src(pathProj.src.img) //Выберем наши картинки
        .pipe(plumberNotifier())
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(pathProj.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
    done();
});

//перенос изображений (для отладки)

gulp.task('mv:img',function(done){
    gulp.src(pathProj.src.img)
        .pipe(plumberNotifier())
        .pipe(gulp.dest(pathProj.build.img))
        .pipe(reload({stream: true}));
     gulp.src(pathProj.src.svgsprt)
        .pipe(gulp.dest(pathProj.build.svg))
        .pipe(reload({stream: true}));
    done();
});


gulp.task('webserver', function (done) {
    browserSync(config);
    done();
});


  // Копирование и оптимизация изображений
gulp.task('img', function () {
    return gulp.src(pathProj.src.img)
        .pipe(plumberNotifier())
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5,
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(pathProj.build.img))
        .pipe(reload({stream: true}));
});


//Слежение
//gulp.task('watch',function (done) {
//    gulp.watch('src/*.html', gulp.series('mv:html'));
//    gulp.watch(pathProj.watch.pug, gulp.series('build:pug'));
//    gulp.watch(pathProj.watch.style, gulp.series('build:scss'));
//    gulp.watch(pathProj.watch.fonts, gulp.series('build:fonts'));
//    gulp.watch(pathProj.watch.js, gulp.series('build:js'));
//    gulp.watch(pathProj.watch.img, gulp.series('build:img'));
//	gulp.watch(pathProj.watch.html, gulp.series('html'));
//    done();
//});

gulp.task('watch', function(done) {
	gulp.watch('src/*.html', gulp.series('build:html'));
    gulp.watch(pathProj.watch.pug, gulp.series('build:pug'));
    gulp.watch(pathProj.watch.style, gulp.series('build:scss')).on('change', browserSync.reload);
    gulp.watch(pathProj.watch.fonts, gulp.series('build:fonts'));
    gulp.watch(pathProj.watch.js, gulp.series('js')).on('change', browserSync.reload);
    gulp.watch(pathProj.watch.img, gulp.series('build:img'));
	gulp.watch(pathProj.watch.html, gulp.series('build:html')).on('change', browserSync.reload);
	done();
})


gulp.task('sftp:push', function (done) {
    gulp.src(pathProj.build.all)
        .pipe(sftp({
            host: site.server,
            user: site.user,
            pass: site.pass,
            port: site.port,
            remotePath:site.folder
        }));
    done();
});



//gulp.task('build',gulp.series('clean',gulp.parallel('build:fonts','build:pug','mv:img','build:js','build:scss')));
//gulp.task('build', gulp.series('clean', gulp.parallel('mv:fonts','mv:js','mv:img',/*'mv:html'*/,'html','build:scss')));

gulp.task('build', gulp.series( gulp.parallel('mv:fonts','mv:js','js', 'mv:img','build:scss','build:html', 'build:pug')));

gulp.task('default', gulp.series('build','webserver','watch')); 