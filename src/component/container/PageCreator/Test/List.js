const data = {
    news: [{
        id: 'string',
        title: 'string',
        content: 'string',
        author: 'string',
        views: 'number',
        date: 'string',
    }]
};
const List = ({ news }) => {
    return (
        <ul>
            {
                news.map(({ id, title, content, date, author, views }) => {
                    return (
                        <li>
                            <p>{title}</p>
                            <p>{content}</p>
                        </li>
                    );
                })
            }
        </ul>
    );
};

export {
    data,
};

export default List;