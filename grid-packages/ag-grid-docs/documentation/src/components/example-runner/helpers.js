import { withPrefix } from 'gatsby';
import { agGridVersion, localPrefix } from './consts';
import { getIndexHtml } from './index-html-helper';

const getInternalFramework = (framework, useFunctionalReact) => {
    if (framework === 'javascript') {
        return 'vanilla';
    } else if (framework === 'react' && useFunctionalReact) {
        return 'reactFunctional';
    }

    return framework;
};

export const getExampleInfo = (nodes, library, pageName, name, title, type, options, framework, importType, useFunctionalReact) => {
    const internalFramework = getInternalFramework(framework, useFunctionalReact);
    const boilerplatePath = `/example-runner/${library}-${framework}-boilerplate/`;

    let sourcePath = `${pageName}/examples/${name}/`;
    let appLocation = `/examples/${pageName}/${name}/`;

    if (library === 'charts') {
        importType = 'packages';
    }

    switch (type) {
        case 'generated':
        case 'mixed':
            sourcePath += `_gen/${importType}/${internalFramework}/`;
            appLocation += `${importType}/${internalFramework}/`;
            break;

        case 'multi':
            sourcePath += `${internalFramework}/`;
            appLocation += `${internalFramework}/`;
            break;

        default:
            break;
    }

    if (type === 'vanilla') {
        framework = 'javascript';
    }

    return {
        library,
        pageName,
        name,
        title,
        type,
        options,
        framework,
        internalFramework,
        importType,
        sourcePath,
        boilerplatePath,
        appLocation,
        getFile: name => nodes.filter(file => file.relativePath === sourcePath + name)[0],
    };
};

const getFrameworkFiles = framework => {
    if (framework === 'javascript') { return []; }

    let files = ['systemjs.config.js'];

    if (isDevelopment()) {
        files.push('systemjs.config.dev.js');
    }

    if (framework === 'angular') {
        files.unshift('main.ts', 'systemjs-angular-loader.js');
    }

    return files;
};

export const getExampleFiles = (nodes, exampleInfo) => {
    const { sourcePath, framework, boilerplatePath } = exampleInfo;

    const filesForExample = nodes
        .filter(node => node.relativePath.startsWith(sourcePath))
        .map(node => ({
            path: node.relativePath.replace(sourcePath, ''),
            publicURL: node.publicURL,
            isFramework: false
        }));

    getFrameworkFiles(framework).forEach(file => filesForExample.push({
        path: file,
        publicURL: withPrefix(boilerplatePath + file),
        isFramework: true,
    }));

    const files = {};
    const promises = [];

    filesForExample.filter(f => f.path !== 'index.html').forEach(f => {
        files[f.path] = null; // preserve ordering

        const promise = fetch(f.publicURL)
            .then(response => response.text())
            .then(source => files[f.path] = { source, isFramework: f.isFramework });

        promises.push(promise);
    });

    files['index.html'] = {
        source: getIndexHtml(nodes, exampleInfo),
        isFramework: false,
    };

    return Promise.all(promises).then(() => files);
};

export const openPlunker = (nodes, exampleInfo) => {
    const { title } = exampleInfo;

    getExampleFiles(nodes, exampleInfo).then(files => {
        const form = document.createElement('form');
        form.method = 'post';
        form.style.display = 'none';
        form.action = '//plnkr.co/edit/?p=preview';
        form.target = '_blank';

        const addHiddenInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;

            form.appendChild(input);
        };

        addHiddenInput('tags[0]', 'ag-grid');
        addHiddenInput('tags[1]', 'example');
        addHiddenInput('private', true);
        addHiddenInput('description', title);

        Object.keys(files).forEach(key => {
            addHiddenInput(`files[${key}]`, files[key].source);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    });
};

export const isDevelopment = () => process.env.NODE_ENV === 'development' || process.env.GATSBY_ENV === 'ci';

export const getCssFilePaths = theme => {
    const themeFiles = theme ?
        [theme] :
        ['alpine-dark', 'alpine', 'balham-dark', 'balham', 'material', 'fresh', 'dark', 'blue', 'bootstrap'];

    const cssFiles = [
        'ag-grid.css',
        ...themeFiles.map(theme => `ag-theme-${theme}.css`)
    ];

    const getCssFilePath = file => isDevelopment() ?
        `${localPrefix}/@ag-grid-community/all-modules/dist/styles/${file}` :
        `https://unpkg.com/@ag-grid-community/all-modules@${agGridVersion}/dist/styles/${file}`;

    return cssFiles.map(getCssFilePath);
};