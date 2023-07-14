import React from 'react';
import Tag from "~/components/Tag";

const Tags = ({ tags }) => {
    return (
        <div className={'rows'}>
            {tags.map(tag => (
                <Tag
                    tag={tag}
                    key={'tag-'+tag.id}
                />
            ))}
        </div>
    );
};

export default Tags;