import React, {useEffect, useState} from 'react';
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import {$api, $apiRoutes, API_URL} from "~/lib/api";

const ImageInput = ({ uuid, images=[], multiple=false, prefix=false, name }) => {
    const [thumb_name, setThumbName] = useState(images.length ? images[0] : null)
    const [images_names, setImagesNames] = useState(images)
    const [files, setFiles] = useState(images
        // .filter(img => img.startsWith(prefix))
        .map(img => {
        return {
            source: img,
            options: {
                type: 'local',
                metadata: {
                    uuid,
                },
            }
        }
    }))

    const _prefix = prefix ? '-' + prefix : ''

    const server = {
        url: API_URL + '/api/',
        // process: 'files/upload/' + uuid + '/images' + _prefix
        //     // + '/true/'
        // ,
        process: {
            // url: 'files/upload/' + uuid + '/images' + (prefix ? ('.' + prefix) : '') + '/true',
            url: 'files/upload/' + uuid + '/images' + _prefix
            // + '/true/'
            ,
            onload: (rs) => {
                const filename = JSON.parse(rs).filename

                if(multiple) {
                    setImagesNames([...images_names, filename])
                    console.log(images_names)
                } else {
                    setThumbName(filename)
                }
            }
        },
        load: 'files/get/' + uuid + '/images' + _prefix + '/',
        remove: {
            url: 'files/delete/',
            method: 'POST',
        },
        revert: {
            url: 'files/delete/',
            method: 'POST',
        },
    };

    registerPlugin(FilePondPluginImageExifOrientation)
    registerPlugin(FilePondPluginImagePreview)

    const deleteFile = (e) => {
        if($api) {
            const uuid = e.detail.file.getMetadata('uuid');
            $api.post($apiRoutes.files.delete, {filename: uuid + '/images/' + _prefix + e.detail.file.filename})
            setImagesNames(images_names.filter(name => name !== e.detail.file.filename))
        }
    }

    // useEffect(() => {
    //     multiple && setImagesNames(files.filter(file => images.includes(file.filename)).map(file => file.filename))
    // }, [files])

    useEffect(() => {
        document.addEventListener('FilePond:removefile', deleteFile);

        return () => document.removeEventListener('FilePond:removefile', deleteFile)
    }, [])

    return (
        <>
            {multiple ? images_names.map(filename => (
                <input key={'image-name-'+filename} type="hidden" name={'images_names'} value={filename} />
            )) : files.length ? <input type="hidden" name={name || 'thumb_name'} value={thumb_name} /> : null}
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                server={server}
                name="image"
                labelIdle={'Выберите картинк' + (multiple ? 'и' : 'у')}
                credits={false}
                allowMultiple={multiple}
                maxFiles={10}
            />
        </>
    );
};

export default ImageInput;