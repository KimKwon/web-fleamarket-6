import styled from 'styled-components';
import PageHeader from '../components/PageHeader/PageHeader';
import { remote } from '../lib/api';
import { CategoryType } from '../types/category';
import colors from '../styles/colors';
import { textXSmall } from '../styles/fonts';
import { LinkButton } from '../lib/Router';
import useQuery from '../hooks/useQuery';
import { CategoryIcon } from '../assets/icons/icons';

const CATEGORY_EXPIRE_TIME = 1000 * 60 * 60 * 5;

function Category() {
  const { data } = useQuery<CategoryType[]>(
    ['category'],
    async () => {
      const result = await remote('/category');
      return result.data;
    },
    {
      expireTime: CATEGORY_EXPIRE_TIME,
    },
  );

  return (
    <main>
      <PageHeader pageName="카테고리" />
      <CategoryIconList>
        <LinkButton moveTo={`/`} className="icon-button">
          <CategoryIcon />
          <span>전체보기</span>
        </LinkButton>
        {data?.map(({ id, name, thumbnail }) => (
          <LinkButton
            options={{ state: thumbnail }}
            moveTo={`/?categoryId=${id}`}
            className="icon-button"
            key={id}
          >
            <img src={thumbnail} alt={`${name}-thumbnail`} />
            <span>{name}</span>
          </LinkButton>
        ))}
      </CategoryIconList>
    </main>
  );
}
const CategoryIconList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem 1rem;

  padding: 3rem 0;

  & > .icon-button {
    justify-self: center;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    & > img,
    & > svg {
      width: 2.5rem;
      height: 2.5rem;
    }

    & > span {
      color: ${colors.black};
      ${textXSmall};
    }
  }
`;

export default Category;
