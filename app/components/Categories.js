import React from 'react';
import Category from "~/components/Category";

const Categories = ({ categories }) => {
    return (
        <div className={'rows'}>
            {categories.map(category => (
                <Category
                    category={category}
                    key={'category-'+category.id}
                />
            ))}
        </div>
    );
};

export default Categories;