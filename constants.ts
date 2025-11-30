import { FlashcardSet } from './types';

export const INITIAL_CARDS: FlashcardSet[] = [
  {
    id: 'init-1',
    createdAt: Date.now(),
    words: [
      {
        word: 'Dominate',
        phonetic: '/ˈdɒmɪneɪt/',
        translation: '支配',
        chineseDefinition: '对某人或某事拥有**控制**或指挥权；在某方面占主导地位。',
        chineseMnemonic: '想象 "Dominoes" (多米诺骨牌)。当你推倒第一块时，你就**支配** (Control) 了所有其他骨牌的命运。',
        examples: [
          {
            en: 'The company hopes to **dominate** the software market.',
            cn: '该公司希望**主导**软件市场。'
          }
        ]
      },
      {
        word: 'Nominate',
        phonetic: '/ˈnɒmɪneɪt/',
        translation: '提名',
        chineseDefinition: '正式建议某人作为职位的候选人或获得荣誉/**奖项**。',
        chineseMnemonic: '想象 "Name" (名字)。当你**提名** (Nominate) 某人时，你就是把他们的名字提出来。',
        examples: [
          {
            en: 'I would like to **nominate** Sarah for the position.',
            cn: '我想**提名**莎拉担任这个职位。'
          }
        ]
      },
      {
        word: 'Intimidate',
        phonetic: '/ɪnˈtɪmɪdeɪt/',
        translation: '恐吓',
        chineseDefinition: '威吓某人，通常是为了强迫他们做某事，使人感到**胆怯**。',
        chineseMnemonic: '词根中有 "Timid" (胆小的)。如果有人**恐吓** (Intimidate) 你，他们就是想让你内心感到胆小 (Timid)。',
        examples: [
          {
            en: 'They tried to **intimidate** the witness into silence.',
            cn: '他们试图**恐吓**证人保持沉默。'
          }
        ]
      }
    ]
  }
];