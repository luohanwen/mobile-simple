/**
 * 为了引用公共的node_modules作了修改，
 * 运行grunt命令时需加上--base 共用node_modules路径（本机共用node_modules路径为D:/devSoft/nodejs/node_global/node_modules/）
 * 构建：grunt build --base D:/devSoft/nodejs/node_global/node_modules/ --force
 * 生成雪碧图 grunt build-sprite --base D:/devSoft/nodejs/node_global/node_modules/ --force
 */
// 引入 path 模块
var path = require('path');
//包装函数
module.exports = function(grunt) {

    // 重新设置 grunt 的项目路径，获取当前的 package.json 文件信息
    grunt.file.setBase(__dirname);
    // 获取当前目录相对于共享 node_modules 目录的路径(以windows下面为例)
    var nodepath = path.relative(__dirname, 'D:/devSoft/nodejs/node_global/node_modules/');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    //任务配置
    grunt.initConfig({
        //读取package.json
        pkg: grunt.file.readJSON("package.json"),
        /*任务concat 对src文件夹里所有js文件进行连接*/
        //清除目录
        clean: {
            all: "css/",
            mobileFlexible: "../mobile-flexible",
            mobileFlexibleNotPublish: ["../mobile-flexible/components/*"]
        },
        //文件拷贝
        copy: {
            src: {
                files: [{
                    expand: true,
                    cwd: 'less',
                    src: ['main.css', "page/*css"],
                    dest: 'css'
                }]
            },
            //copy到mobile-flexible项目，用于发布npm社区（忽略一下文件）
            mobileFlexible: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['**'],
                    dest: '../mobile-flexible'
                }]
            }
        },

        // 文件合并
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            js: {
                src: [
                    "weekendTrip/www/js/*.js",
                    "weekendTrip/www/js/**/*.js",
                ],
                dest: "dist/tmp/main.js"
            }
        },

        //压缩JS
        uglify: {
            prod: {
                // options: {
                //     mangle: {
                //         except: ['require', 'exports', 'module', 'window']
                //     },
                //     compress: {
                //         global_defs: {
                //             PROD: true
                //         },
                //         dead_code: true,
                //         pure_funcs: [
                //             "console.log",
                //             "console.info"
                //         ]
                //     }
                // },
                src: "dist/tmp/main.js",
                dest: "dist/js/main.min.js"
            }
        },

        //压缩CSS
        cssmin: {
            minify: {
                files: [{
                    options: {
                        report: 'gzip'
                    },
                    expand: true,
                    cwd: 'css',
                    src: ['main.css', "page/*.css"],
                    dest: 'css',
                    ext: ".min.css"
                }]
            }
        },

        // 处理html中css、js 引入合并问题,导入文件名称在html文件的注释里
        usemin: {
            html: 'dist/*.html',
        },
        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        // 解决压缩后angular.js注入报错问题
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dist/tmp',
                    src: ['*.js', '!oldieshim.js'],
                    dest: 'dist/tmp'
                }]
            }
        },
        //监听文件，执行对应操作
        watch: {
            scripts: {
                files: ['less/main.css'],
                tasks: ['build']
            },
            less: {
                files: ['less/page/*.less'],
                tasks: ['less']
            },
        },
        //自动生成css兼容性前缀
        autoprefixer: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['css/*.css', "css/page/*css"],
                    dest: ''
                }]
            }
        },
        //生成雪碧图
        sprite: {
            options: {
                banner: '/*<%=pkg.name %> <%=grunt.template.today("yyyy-mm-dd")%>*/\n'
            },
            all: {
                src: "images/sprite/*.png",
                dest: "images/spritesheet/spritesheet.png",
                destCss: "less/sprite.less",
                cssTemplate: "handlebars/sprite-icon.handlebars",
                //				algorithm: "binary-tree"
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['less/main.css', '*.html','js/*.js']
                },
                options: {
                	watchTask:true,
                    // proxy: "172.28.44.8:5000",
                    server:"./"
                }
            }
        },
        less: {
            dev: {
                options: {
                    // paths: [''],
                    sourceMap: true
                },
                files: {
                    'less/main.css': 'less/main.less'
                }
            },
        }
    });

    // Load grunt tasks automatically
    //	require('load-grunt-tasks')(grunt);
    //加载任务所需插件
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-usemin');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-concat", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-uglify", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-cssmin", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-jshint", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-imagemin", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-htmlmin", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-clean", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-usemin", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-copy", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-watch", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-autoprefixer", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-spritesmith", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-browser-sync", 'tasks'));
    grunt.task.loadTasks(path.join(nodepath, "grunt-contrib-less", 'tasks'));

    //建立指定任务
    grunt.registerTask("build", [
        "clean:all",
        "copy:src",
        "autoprefixer",
        "cssmin"
    ]);
    //建立指定任务
    grunt.registerTask("dowatch", [
        "watch"
    ]);
    grunt.registerTask("build-sprite", [
        "sprite",
    ]);
    //拷贝项目到mobile-flexible,用于发布到npm社区
    grunt.registerTask("npmpublish", [
        "clean:mobileFlexible",
        "copy:mobileFlexible",
        "clean:mobileFlexibleNotPublish"
    ]);
    //实时刷新浏览器
    grunt.registerTask("browser", [
        "browserSync",
        "watch:less"
    ]);
    //编译less
    grunt.registerTask("less2css", [
        "less:dev"
    ]);

};