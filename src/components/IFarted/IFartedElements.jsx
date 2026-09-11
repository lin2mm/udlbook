import styled from "styled-components";

export const IFartedContainer = styled.div`
  color: #000;
  background: #fff7ed;
  padding: 80px 0;

  @media screen and (max-width: 768px) {
    padding: 60px 0;
  }
`;

export const IFartedWrapper = styled.div`
  display: grid;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  margin-right: auto;
  margin-left: auto;
  padding: 0 24px;
  justify-content: center;
`;

export const IFartedRow = styled.div`
  display: grid;
  grid-auto-columns: minmax(auto, 1fr);
  align-items: center;
  grid-template-areas: ${({ imgStart }) => (imgStart ? `'col2 col1'` : `'col1 col2'`)};

  @media screen and (max-width: 768px) {
    grid-template-areas: ${({ imgStart }) => (imgStart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`)};
  }
`;

export const Column1 = styled.div`
  margin-bottom: 15px;
  padding: 0 15px;
  grid-area: col1;
`;

export const Column2 = styled.div`
  margin-bottom: 15px;
  padding: 0 15px;
  grid-area: col2;
`;

export const TextWrapper = styled.div`
  max-width: 540px;
  padding-top: 0;
  padding-bottom: 60px;
`;

export const TopLine = styled.p`
  color: #ea580c;
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const Heading = styled.h1`
  margin-bottom: 24px;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 600;
  color: #000;

  @media screen and (max-width: 480px) {
    font-size: 32px;
  }
`;

export const Subtitle = styled.p`
  max-width: 440px;
  margin-bottom: 35px;
  font-size: 18px;
  line-height: 24px;
  color: #333;
`;

export const DemoBox = styled.div`
  background: #fff;
  border: 2px solid #000;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  box-shadow: 8px 8px 0px #000;
`;

export const DemoTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const FriendRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

export const FartButton = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #333;
  }
  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

export const SmallText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 12px;
`;

export const Link = styled.a`
  color: #ea580c;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;
