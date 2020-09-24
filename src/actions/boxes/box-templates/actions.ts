import axios from 'axios';
import { ObjectLiteral, QueryParams } from 'src/interfaces';
import { ThunkResult } from 'src/actions';
import { BoxTemplates, BoxTemplatesActionTypes, BoxTemplatesState } from './types';
import { API, apis } from 'src/services/api-data';
import { getAPIData } from 'src/utils/api';
import { BoxColumnTemplate, BoxColumnTemplateAPIResponse, BoxTemplate } from './interfaces';

/*
Example ...
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})*/

export const getBoxTemplates = (queryParams?: QueryParams): ThunkResult => async (dispatch, getState) => {
  const isFetching = getState().boxes.templates.isFetching;
  if (isFetching) return;

  dispatch(fetching(true));

  const params: QueryParams = {
    order: { id: 'ASC' },
    ...queryParams,
  };

  const apiName = API.CAJA;
  const methodName = 'preview';
  const api = getAPIData(apiName, methodName);

  const { url } = api;
  const { verb, path, headers } = api.method;

  const endpoint = `${url}/${path}`;

  const data = {
    idCaja: 1,
    idPlantilla: 102,
    tipoContenido: 'Caja con Detalle',
  };

  console.log(url);
  console.log(path);
  console.log(endpoint);

  return await axios({ method: verb, url: endpoint, headers, data })
    .then((response) => {
      let id = -1;
      const rawData: BoxColumnTemplateAPIResponse[] = response.data;
      const columnsTemplate: BoxColumnTemplate[] = rawData.map((d) => {
        id = d.idPlantilla;
        return {
          id: d.id,
          title: d.titulo,
          dataType: d.tipo,
          required: d.opcional,
          order: d.orden,
          length: d.longitud,
        } as BoxColumnTemplate;
      });
      dispatch(success({ id, columnsTemplate }));
    })
    .catch((error) => {
      console.log('response error');
      dispatch(failure());
    });

  function fetching(fetch: BoxTemplatesState['isFetching']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.FETCHING, payload: fetch };
  }

  function success(template: BoxTemplatesState['template']): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_SUCCESS, payload: template };
  }

  function failure(): BoxTemplatesActionTypes {
    return { type: BoxTemplates.GET_FAILURE };
  }
};
